import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class RazorpayService {

  private scriptLoaded = false;

  loadScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.scriptLoaded) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        this.scriptLoaded = true;
        resolve(true);
      };
      document.body.appendChild(script);
    });
  }

  openCheckout(options: any) {
    options.key = environment.razorpayKey;
    const rzp = new Razorpay(options);
    rzp.open();
  }
}
