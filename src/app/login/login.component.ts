import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AddcartService } from '../services/addcart.service';
import { AuthService } from '../auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { TermsAndConditionComponent } from '../terms-and-condition/terms-and-condition.component';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent implements OnInit {
hidePassword:boolean = true;
  loginForm: FormGroup = new FormGroup({
    mobile: new FormControl('', [Validators.required, Validators.pattern(/^([0-9]{10}|[^\s@]+@[^\s@]+\.[^\s@]+)$/)]),
    password: new FormControl('', [Validators.required])
  });

  public loginErrToast: boolean = false;
  constructor(public router: Router,
    public loginService: LoginService,
    private apiService: ApiService,
    private toastr: ToastrService,
    public addcartService: AddcartService,
    public authService:AuthService,
    private dialog: MatDialog,
    private ngZone: NgZone) { }
  pass: any
  mobile: any
  ngOnInit() {
  }

openForgotPassword() {
  this.dialog.open(ForgotPasswordComponent, {
    width: '300px',
    maxWidth: '90vw',
    panelClass: 'custom-dialog'
  });
}

  signup() {
    this.router.navigate(['signup'])
  }

forgotPasswordPopup(){

}
userLogin(loginData: any): void {

  if (!this.loginForm.valid) return;

  const payload = {
    login: loginData.mobile,   // email OR phone
    password: loginData.password
  };

  this.apiService.getUserDetailsData(payload).subscribe({
    next: (res: any) => {
      /* SAVE TOKEN */
      //this.authService.saveToken(res.token);
      this.authService.setTokens(res.access_token, res.refresh_token);
      const user = res.user;
      user.userId = `user_${user.id}`;
      user.isGuest = false;
      const guestId = this.loginService.getUser()?.userId;
      this.loginService.setUser(user);
      this.addcartService.loadCartFromAPI();
      /* TRANSFER GUEST CART */
      if (guestId?.startsWith('guest_')) {
       // this.addcartService.transferCart(guestId, user.userId);
      }

      this.loginForm.reset();

      this.router.navigate(['/']);

      this.toastr.success(
        'You are login successfully!',
        `Welcome, ${user.user_first_name}`
      );

    },

    error: err => {

      console.error(err);
 // ✅ Show backend error message if available
      const msg = err?.error?.message || `'User not found. Please register first or might be wrong credential.',  'Login Failed'`;
      this.toastr.error(msg, 'Login Failed');

    }

  });

}

  openTermsAndConditionDialog() {
    const dialogRef = this.dialog.open(TermsAndConditionComponent, {
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {

    });

  }
  openPrivacyPolicyDialog() {
    const dialogRef = this.dialog.open(PrivacyPolicyComponent, {
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
