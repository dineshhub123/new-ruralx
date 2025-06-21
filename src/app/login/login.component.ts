import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { ApiService } from '../api.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({
    mobile: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  public loginErrToast: boolean = false;
  constructor(public router: Router,
    public loginService: LoginService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private ngZone: NgZone) { }
  pass: any
  mobile: any
  ngOnInit() {
  }
  signup() {
    this.router.navigate(['signup'])
  }


 adminLogin(loginData: any) {
  if (this.loginForm.valid) {
    this.apiService.getUserDetailsData().subscribe((res) => {
      try {
        const findObject = res.find(
          (item: any) =>
            item.user_password === loginData?.password &&
            (item?.user_phone === loginData?.mobile || item?.user_email === loginData?.mobile)
        );

        console.log(findObject, 'find');

        if (findObject) {
          localStorage.setItem('login_user', JSON.stringify(findObject));
          this.loginService.setUsername(findObject?.user_first_name);
          this.toastr.success('Login successful!', 'Welcome');
          setTimeout(() => {
            this.router.navigate(['dashboard']);
            this.loginForm.reset();
          }, 2000);
        } else {
          this.toastr.error('User not found. Please register first.', 'Login Failed');
        }
      } catch (error) {
        console.error('An error occurred during login:', error);
        this.toastr.error('An unexpected error occurred. Please try again.', 'Login Error');
      }
    });
  }
}



}
