package com.demo.vttp.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class PostingController {

    @Autowired
    private JedisConnectionFactory jedisConnectionFactory;

    @Autowired
    private AmazonS3 amazonS3;

    @Value("${aws.s3.csfspaces}")
    private String bucketName;

    @PostMapping("/posting")
    public ResponseEntity<Map<String, String>> handlePosting(@RequestParam("sellerName") String sellerName,
            @RequestParam("sellerEmail") String sellerEmail,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("image") MultipartFile image) {
        Map<String, String> response = new HashMap<>();
        try {
            // Generate a posting id
            String postingId = UUID.randomUUID().toString().substring(0, 8);

            // Get current date
            LocalDateTime postingDate = LocalDateTime.now();

            // Save posting to Redis
            Jedis jedis = jedisConnectionFactory.getShard(postingId);
            Map<String, String> posting = new HashMap<>();
            posting.put("sellerName", sellerName);
            posting.put("sellerEmail", sellerEmail);
            posting.put("title", title);
            posting.put("description", description);
            posting.put("postingDate", postingDate.toString());
            jedis.setex(postingId, 900, new ObjectMapper().writeValueAsString(posting));

            // Save image to S3 bucket
            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setContentType(image.getContentType());
            objectMetadata.setContentLength(image.getSize());
            PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, postingId, image.getInputStream(),
                    objectMetadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead);
            amazonS3.putObject(putObjectRequest);

            // Prepare response
            response.put("postingId", postingId);
            response.put("postingDate", postingDate.toString());
            response.put("sellerName", sellerName);
            response.put("sellerEmail", sellerEmail);
            response.put("title", title);
            response.put("description", description);
            response.put("image", amazonS3.getUrl(bucketName, postingId).toString());

            return ResponseEntity.ok().body(response);

        } catch (IOException e) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("error", "Failed to handle posting: " + e.getMessage()));
        }
    }

    @PutMapping("/posting/{postingId}")
    public ResponseEntity<?> confirmPosting(@PathVariable("postingId") String postingId) {
        String postingJson = redisTemplate.opsForValue().get(postingId);
        if (postingJson == null) {
            return ResponseEntity.notFound().body("{\"message\":\"Posting ID " + postingId + " not found\"}");
        }

        // delete the posting entry from Redis
        redisTemplate.delete(postingId);

        // convert the JSON string to a Posting object
        ObjectMapper mapper = new ObjectMapper();
        Posting posting = mapper.readValue(postingJson, Posting.class);

        // save the details of the posting to the MySQL database
        postingRepository.save(posting);

        // send an OK status code back to the frontend with the following payload
        // "message": "Accepted (posting id: <posting id>)"
        return ResponseEntity.ok().body("{\"message\":\"Accepted (posting id: " + postingId + ")\"}");
    }
}