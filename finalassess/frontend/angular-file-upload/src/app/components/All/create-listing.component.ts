import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-listing',
  template: `
  <form [formGroup]="listingForm" (ngSubmit)="onSubmit()">
    <label>
      Seller's Name:
      <input type="text" formControlName="sellerName">
      <div *ngIf="sellerName.invalid && sellerName.touched">
        Seller's name is required and should be at least 3 characters long
      </div>
    </label>
    <br>
    <label>
      Seller's Email:
      <input type="email" formControlName="sellerEmail">
      <div *ngIf="sellerEmail.invalid && sellerEmail.touched">
        Seller's email is required and should have a maximum length of 128 characters
      </div>
    </label>
    <br>
    <label>
      Title:
      <input type="text" formControlName="title">
      <div *ngIf="title.invalid && title.touched">
        Title is required and should not be shorter than 5 characters and no longer than 128 characters
      </div>
    </label>
    <br>
    <label>
      Description:
      <textarea formControlName="description"></textarea>
      <div *ngIf="description.invalid && description.touched">
        Description is required
      </div>
    </label>
    <br>
    <label>
      Image:
      <input type="file" (change)="onFileChange($event)" #fileInput formControlName="image">
      <div *ngIf="image.invalid && image.touched">
        Image is required
      </div>
    </label>
    <br>
    <button type="submit" [disabled]="!listingForm.valid">Post</button>
  </form>
  `
})
export class CreateListingComponent implements OnInit {
  listingForm: FormGroup;
  image: File;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.listingForm = this.formBuilder.group({
      sellerName: ['', [Validators.required, Validators.minLength(3)]],
      sellerEmail: ['', [Validators.required, Validators.maxLength(128)]],
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(128)]],
      description: ['', [Validators.required]],
      image: [null, [Validators.required]]
    });
  }

  get sellerName() {
    return this.listingForm.get('sellerName');
  }

  get sellerEmail() {
    return this.listingForm.get('sellerEmail');
  }

  get title() {
    return this

      }
        get description() {
        return this.listingForm.get('description');
      }
    
      get Image() {
        return this.listingForm.get('image');
      }
    
      onFileChange(event) {
        this.image = event.target.files[0];
      }
    
      onSubmit() {
        if (this.listingForm.valid) {
          const formData = new FormData();
          formData.append('sellerName', this.sellerName.value);
          formData.append('sellerEmail', this.sellerEmail.value);
          formData.append('title', this.title.value);
          formData.append('description', this.description.value);
          formData.append('image', this.image);
    
          const headers = new HttpHeaders({
            'Accept': 'application/json'
          });
    
          this.http.post('http://localhost:8080/api/posting', formData, { headers: headers })
            .subscribe(
              (response) => {
                // Handle successful response
                console.log(response);
                //Navigate to View 1 for confirmation message or View 2 for list view 
              },
              (error: HttpErrorResponse) => {
                // Handle error
                console.error(error);
              }
            );
        }
      }
    }
    