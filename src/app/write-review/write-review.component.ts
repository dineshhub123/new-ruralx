import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-write-review',
  templateUrl: './write-review.component.html',
  styleUrls: ['./write-review.component.css']
})
export class WriteReviewComponent implements OnInit {
  productId: any;
  userId: any;
  review = {
    rating: 0,
    title: '',
    text: '',
    images: [] as File[]
  };
  reviewForm!: FormGroup;
  previewImages: string[] = [];
  selectedFiles: File[] = [];
  public isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder

  ) {
    let user: any
    user = localStorage.getItem("login_user")
    this.userId = JSON.parse(user);
  }

  ngOnInit() {
    this.reviewForm = this.fb.group({
      rating: [0, Validators.required],
      title: ['', Validators.required],
      text: ['', Validators.required]
    });
    this.productId = this.route.snapshot.paramMap.get('id');
    console.log(this.productId)
        console.log(this.userId)

  }

  // ⭐ Star Click
  selectRating(star: number) {
    this.reviewForm.patchValue({
      rating: star
    });
  }
  // ⭐ Image Upload
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
resetSelectedImage(){
  this.previewImages=[];
  this.selectedFiles = [];
}
  submitReview() {
    try {
      if (this.reviewForm.invalid) return;
      this.isLoading = true;
      const formData = new FormData();
      formData.append('product_id', this.productId);
      formData.append('user_id', this.userId?.userId);
      formData.append('user_name', this.userId?.user_first_name);
      formData.append('rating', String(this.reviewForm.value.rating));
      formData.append('title', this.reviewForm.value.title);
      formData.append('text', this.reviewForm.value.text);
       for (let file of this.selectedFiles) {
         formData.append('images[]', file);
       }

      this.apiService.submitReview(formData).subscribe((res) => {
        if (res?.status)
          this.isLoading = false;
          this.toastr.success(`${res?.msg}`)
          this.reviewForm.reset();
          this.selectedFiles = [];
          this.previewImages = [];
        setTimeout(() => {
        this.router.navigate(['/pzoom']);
      }, 3000);
      })
    } catch (err) {
      console.log(err)
      this.isLoading = false;
    }
  }

  goBack() {
    this.router.navigate(['/pzoom']);
  }

}
