import { Component } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-return-dailog',
  templateUrl: './return-dailog.component.html',
  styleUrls: ['./return-dailog.component.css']
})
export class ReturnDailogComponent {
  selectedReason: string = '';
  returnType: string = 'Refund';
  selectedFile: any;
  imageBaseUrl = environment.imageBaseUrl;
  previewImages: string[] = [];
  selectedFiles: File[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public apiService:ApiService) {

  }

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }
  onImageSelect(event: any) {
    const files = event.target.files;
    for (let file of files) {
      if (this.selectedFiles.length >= 3) return;
      this.selectedFiles.push(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImages.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }
  resetSelectedImage() {
    this.previewImages = [];
    this.selectedFiles = [];
  }
  ngOninit() {
  }
  submitReturn() {
    try {
      const returnPayload = {
        user_id: "1",
        order_id: this.data.orderId.order_id,
        product_id: this.data.item.product_id,
        reason: this.selectedReason,
        return_type: this.returnType   // REFUND or REPLACE
      };

      //console.log("returnPayload",returnPayload);
      this.apiService.returnOrder(returnPayload).subscribe(res=>{
        console.log(res)
      })

    } catch (err) {
      console.log(err)
    }
  }
}