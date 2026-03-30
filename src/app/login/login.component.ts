import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AddcartService } from '../services/addcart.service';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent implements OnInit {

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
    private ngZone: NgZone) { }
  pass: any
  mobile: any
  ngOnInit() {
  }
  signup() {
    this.router.navigate(['signup'])
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

      this.toastr.error(
        'User not found. Please register first or might be wrong credential.',
        'Login Failed'
      );

    }

  });

}
}
