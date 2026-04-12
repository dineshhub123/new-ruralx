import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;
  isLoading: boolean = false;
  constructor(
    public router: Router,
    private apiService: ApiService,
    private fb: FormBuilder,
    public toastr: ToastrService
  ) { }

  ngOnInit() {
    this.signupForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      house_no: ['', [Validators.required]],
      street_area: ['', [Validators.required]],
      landmark: ['', [Validators.required]],
      post_office: ['', [Validators.required]],
      tehsil: ['', [Validators.required]],
      district: ['', [Validators.required]],
      state: ['Madhya Pradesh', [Validators.required]],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      country: ['India', [Validators.required]],

    });
  }

  get f() { return this.signupForm.controls; }

  userSignup() {

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    const payload = {
      u_firstname: this.signupForm.value.firstname,
      u_lastname: this.signupForm.value.lastname,
      u_email: this.signupForm.value.email,
      u_phone: this.signupForm.value.phone,
      u_password: this.signupForm.value.password,
      u_pincode: this.signupForm.value.pincode,
      u_house_no: this.signupForm.value.house_no,
      u_street_area: this.signupForm.value.street_area,
      u_post_office: this.signupForm.value.post_office,
      u_landmark: this.signupForm.value.landmark,
      u_tehsil: this.signupForm.value.tehsil,
      u_district: this.signupForm.value.district,
      u_state: this.signupForm.value.state,
      u_country: this.signupForm.value.country
    };
    this.isLoading = true;
    this.apiService.insertUserDetails(payload)
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (!res.success) {
            this.toastr.error(res.message || 'Registration failed');
            return;
          }
          // Show backend message
          this.toastr.success(
            res.message,
            `Welcome aboard, ${this.signupForm.value.firstname}!`
          );
          this.signupForm.reset();
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },
        error: (err) => {
          this.isLoading = false;
          let message = err?.error?.message || `'Registration failed. Please try again.'`;
          if (err.status === 409) {
            message = err.error?.message || 'User already exists';
          } else if (err.status === 400) {
            message = err.error?.message || 'Invalid data';
          } else if (err.status === 0) {
            message = 'Unable to connect to server';
          } else {
            message = err.error?.message || message;
          }
          this.toastr.error(message, 'Registration Failed');
        },
        complete: () => {
          console.log('Signup API completed');
        }
      });
  }
}
