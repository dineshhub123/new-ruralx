import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-screenshot',
  templateUrl: './upload-screenshot.component.html',
  styleUrls: ['./upload-screenshot.component.css']
})
export class UploadScreenshotComponent {
file: any = null;
  constructor(private router: Router) {}


onFileSelected(event: any) {
  this.file = event.target.files[0];
}

submit() {
  // TODO: upload to backend API
  this.router.navigate(['/waiting-verification']);
}

}
