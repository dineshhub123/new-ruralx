import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {


  step: 'mobile' | 'otp' | 'password' = 'mobile';

  mobileForm!: FormGroup;
  otpForm!: FormGroup;
  passwordForm!: FormGroup;
  hidePassword = true;
  hideConfirm = true;

  constructor(private fb: FormBuilder, private apiService: ApiService, public toastr: ToastrService,private dialogRef: MatDialogRef<ForgotPasswordComponent>) { }

  ngOnInit(): void {


    // Step 1: Mobile
    this.mobileForm = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]]
    });

    // Step 2: OTP
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Step 3: Password
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  //Custom Validator
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    if (!confirm) return null; // avoid early error
    return password === confirm ? null : { mismatch: true };
  }
  //Send OTP
  sendOtp() {
    if (this.mobileForm.invalid) return;
    const mobile = { mobile: this.mobileForm.value.mobile }
    this.apiService.forgotPassSendOtp(mobile).subscribe({
      next: (res: any) => {
        if (res.status === "success") {
          this.toastr.success(res.message)
          this.step = 'otp'; // move to OTP screen
        } else {
          this.toastr.error(res.message)
        }
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Something went wrong');
      }
    });

  }

  //Verify OTP
  verifyOtp() {
    if (this.otpForm.invalid) return;
    console.log('Verify OTP:', this.otpForm.value.otp);
    const payload = {
      mobile: this.mobileForm.value.mobile,
      otp: this.otpForm.value.otp
    };

    this.apiService.verifyForgotOtp(payload).subscribe({
      next: (res: any) => {
        if (res.status === "success") {
          this.toastr.success(res.message);
          this.step = 'password'; // move to password screen
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Something went wrong');
      }
    });

  }

  // Reset Password
  resetPassword() {
    if (this.passwordForm.invalid) return;
    const payload = {
      mobile: this.mobileForm.value.mobile,
      password: this.passwordForm.value.password
    };

    this.apiService.resetPassword(payload).subscribe({
      next: (res: any) => {
        if (res.status === "success") {
          this.toastr.success(res.message);
          // reset UI
          this.mobileForm.reset();
          this.otpForm.reset();
          this.passwordForm.reset();
          this.dialogRef.close(true); 
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Something went wrong');
      }
    });

  }
}




