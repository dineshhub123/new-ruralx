import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

selectedFiles: { [key: string]: File } = {};
  constructor(private apiService:ApiService,private router:Router) { }

  ngOnInit() {
  }
htmlContent: string = '';
 editorConfig = {
  editable: true,
  spellcheck: true,
  height: '300px',
  minHeight: '0',
  maxHeight: 'auto',
  width: '100%',
  minWidth: '0',
  translate: 'yes',
  enableToolbar: true,
  showToolbar: true,
  placeholder: 'Enter text here...',
  defaultParagraphSeparator: 'p',
  defaultFontName: 'Arial',
  defaultFontSize: '4',
  fonts: [
    { class: 'arial', name: 'Arial' },
    { class: 'times-new-roman', name: 'Times New Roman' },
    { class: 'calibri', name: 'Calibri' },
    { class: 'comic-sans-ms', name: 'Comic Sans MS' }
  ],
  customClasses: [
    {
      name: 'quote',
      class: 'quote'
    },
    {
      name: 'redText',
      class: 'redText'
    },
    {
      name: 'titleText',
      class: 'titleText',
      tag: 'h1',
    }
  ],
  
};
    


onSelectFile(event: any, field: string): void {
  const file: File = event.target.files[0];

  if (file) {
    // Store the selected file in the selectedFiles object
    this.selectedFiles[field] = file;
    console.log(`${field} file:`, file.name);
  }
}



 uploadFormData(data: any): void {
  const formData = new FormData();
  if (data?.value?.p_name) {
    formData.append('p_name', data?.value?.p_name);
  }
  if (data?.value?.p_price) {
    formData.append('p_price', data?.value?.p_price);
  }
  if (data?.value?.p_mrp) {
    formData.append('p_mrp', data?.value?.p_mrp);
  }
  if (data?.value?.p_discount) {
    formData.append('p_discount', data?.value?.p_discount);
  }
  if (data?.value?.delivery_date) {
    formData.append('delivery_date', data?.value?.delivery_date);
  }
  if (data?.value?.p_category) {
    formData.append('p_category', data?.value?.p_category);
  }
  if (data?.value?.p_description) {
    formData.append('p_description', data?.value?.p_description);
  }
  if (data?.value?.p_image) {
    formData.append('.p_image', data?.value?.p_image);
  }
  if (this.selectedFiles['image_front']) {
    formData.append('image_front', this.selectedFiles['image_front']);

  }
  if (this.selectedFiles['image_back']) {
    formData.append('image_back', this.selectedFiles['image_back']);
  }
  if (this.selectedFiles['image_side']) {
    formData.append('image_side', this.selectedFiles['image_side']);
  }
  if (this.selectedFiles['image_top']) {
    formData.append('image_top', this.selectedFiles['image_top']);
  }
  if (this.selectedFiles['image_triangle']) {
    formData.append('image_triangle', this.selectedFiles['image_triangle']);
  }
console.log("formData",formData)
  this.apiService.uploadData(formData).subscribe((res: any) => {
    console.log('Upload success:', res);
  }, (error) => {
    console.error('Upload failed:', error);
  });

    
  }
}
