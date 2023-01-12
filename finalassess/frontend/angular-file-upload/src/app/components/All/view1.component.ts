import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view1',
  templateUrl: './view1.component.html',
  styleUrls: ['./view1.component.css']
})
export class View1Component implements OnInit {

  postingId!: string;
  postingDate!: Date;
  name!: string;
  email!: string;
  phone!: string;
  title1: string;
  description!: string;
  imageUrl!: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      // extract data from the route and assign it to component properties
      this.postingId = data.posting.postingId;
      this.postingDate = data.posting.postingDate;
      this.name = data.posting.name;
      this.email = data.posting.email;
      this.phone = data.posting.phone;
      this.title = data.posting.title;
      this.description = data.posting.description;
      this.imageUrl = data.posting.image;
    });
  }

  confirmPosting() {
    this.http.put(`/api/posting/${this.postingId}`, {})
    .subscribe(response => {
      if (response.status === 200) {
        // transition to View 2
      }
    }, error => {
      console.error(error);
    });
}  }
