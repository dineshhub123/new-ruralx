import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pay-upi',
  templateUrl: './pay-upi.component.html',
  styleUrls: ['./pay-upi.component.css']
})
export class PayUpiComponent {

   amount: number = 100;  // dynamically replace from cart total

  upiLink = "";

  constructor(private router: Router) {}

  ngOnInit() {
    this.generateUpiLink();
  }

  generateUpiLink() {
    this.upiLink =
      `upi://pay?pa=ruralx@upi&pn=RuralX&am=${this.amount}&cu=INR`;
  }

  goToUpload() {
    this.router.navigate(['/upload-screenshot']);
  }


}
