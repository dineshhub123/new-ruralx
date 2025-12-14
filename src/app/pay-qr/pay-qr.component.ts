import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pay-qr',
  templateUrl: './pay-qr.component.html',
  styleUrls: ['./pay-qr.component.css']
})
export class PayQrComponent {
  upiId = "ruralx@upi";

    constructor(private router: Router) {}

uploadScreenshot(){
  this.router.navigate(['/upload-screenshot']);

}
copyUpiId() {
  const upi = this.upiId;

  // Modern browsers – use Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(upi)
      .then(() => alert("UPI ID copied!"))
      .catch(() => this.fallbackCopy(upi));
  } else {
    // Fallback
    this.fallbackCopy(upi);
  }
}

fallbackCopy(text: string) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);

  alert("UPI ID copied!");
}

  downloadQr() {
    const link = document.createElement('a');
    link.href = "../assets/img/qr.jpg";
    link.download = "ruralx_qr.jpg";
    link.click();
  }
}
