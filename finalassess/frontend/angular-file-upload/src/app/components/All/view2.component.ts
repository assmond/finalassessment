import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view2.component',
  template: `
    <div *ngIf="postingId">
      <h2>Thank you for using our service!</h2>
      <p>Your posting id is {{ postingId }}</p>
      <button (click)="goToView0()">Back</button>
    </div>
  `,
  styles: []
})
export class View2Component implements OnInit {
  postingId!: string;
  
  constructor(private route: ActivatedRoute, private location: Location) { }

  ngOnInit() {
    // retrieve the posting id from the route parameters or a service
    this.route.paramMap.subscribe(params => {
      this.postingId = params.get("postingId");
    });
  }

  goToView0() {
    // navigate back to View 0
    this.location.back();
  }
}
