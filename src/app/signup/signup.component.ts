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
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required, Validators.minLength(30)]],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  get f() { return this.signupForm.controls; }

  userSignup() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    let payload = {
      u_firstname: this.signupForm.value.firstname,
      u_lastname: this.signupForm.value.lastname,
      u_email: this.signupForm.value.email,
      u_phone: this.signupForm.value.phone,
      u_password: this.signupForm.value.password,
      u_address: this.signupForm.value.address,
      u_pincode: this.signupForm.value.pincode
    };

    this.apiService.insertUserDetails(payload).subscribe(
      (res) => {
        this.toastr.success( `Your registration is complete. You can now log in!`,`Welcome aboard, ${this.signupForm.value.firstname}!`
        );
        setTimeout(() => {
          this.router.navigateByUrl('login');
        }, 1000)
      },
      (err) => {
        console.error("Signup Failed:", err);
      }
    );
  }
}
