import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-payment-options',
  templateUrl: './payment-options.component.html',
  styleUrls: ['./payment-options.component.css']
})
export class PaymentOptionsComponent {
paymentMethod: string = 'upi';  // default
  buttonText: string = 'Pay Now'; // default button
constructor(public router:Router){

}
  select(method: string) {
    this.paymentMethod = method;

    if (method === 'upi') {
      this.buttonText = 'Pay Now';
    }
    else if (method === 'qr') {
      this.buttonText = 'Scan & Pay';
    }
    else if (method === 'cod') {
      this.buttonText = 'Place Order';
    }
  }

  submit() {
    if (this.paymentMethod === 'upi') {
      this.router.navigateByUrl('/pay-upi')
    }
    if (this.paymentMethod === 'qr') {
      this.router.navigateByUrl('/pay-qr')
    }
    if (this.paymentMethod === 'cod') {
      this.router.navigateByUrl('/cod-confirm')
    }
  }

}
