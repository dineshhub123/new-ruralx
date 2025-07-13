import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { ApiService } from '../api.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AddcartService } from '../addcart.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
 
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
    public addcartService:AddcartService,
    private ngZone: NgZone) { }
  pass: any
  mobile: any
  ngOnInit() {
  }
  signup() {
    this.router.navigate(['signup'])
  }

// userLogin(loginData: any): void {
//   if (!this.loginForm.valid) {
//     return;
//   }

//   this.apiService.getUserDetailsData().subscribe({
//     next: (users) => {
//       const found = users.find(
//         (u: any) =>
//           u.user_password === loginData.password &&
//           (u.user_phone === loginData.mobile || u.user_email === loginData.mobile)
//       );
//       if (found) {
//         let userCartItems:any=[]
//         found.userId = `user_${found.id}`;
//         found.user_first_name = found.user_first_name;
//         found.isGuest =  false // or omit
//         this.loginService.setUser(found);
//         const saveCartItems = this.addcartService.getCart();
//         userCartItems = saveCartItems.filter((item: any) => item.userId === found.userId);
//         this.addcartService.setCart(userCartItems); // you need a method like this in your service
//         this.loginForm.reset();
//         this.router.navigate(['/']);
//         this.toastr.success('Login successful!', 'Welcome');

//       } else {
//         this.toastr.error('User not found. Please register first.', 'Login Failed');
//       }
//     },
//     error: (err) => {
//       console.error('An error occurred during login:', err);
//       this.toastr.error('An unexpected error occurred. Please try again.', 'Login Error');
//     }
//   });
// }
userLogin(loginData: any): void {
  if (!this.loginForm.valid) return;

  /*remember current (guest) user before we switch */
  const guestId = this.loginService.getUser()?.userId;

  this.apiService.getUserDetailsData().subscribe({
    next: users => {
      const found = users.find((u:any) =>
        u.user_password === loginData.password &&
        (u.user_phone === loginData.mobile || u.user_email === loginData.mobile));

      if (!found) {
        this.toastr.error('User not found. Please register first or might be wrong credential.', 'Login Failed');
        return;
      }
      found.userId = `user_${found.id}`;
      found.isGuest = false;
      this.loginService.setUser(found);
      if (guestId && guestId.startsWith('guest_')) {
        this.addcartService.transferCart(guestId, found.userId);
      }
      this.loginForm.reset();
      this.router.navigate(['/']);
      this.toastr.success('You are login successfully!', `Welcome, ${found.user_first_name}`);
    },
    error: err => {
      console.error('Login error:', err);
      this.toastr.error('Unexpected error. Please try again.', 'Login Error');
    }
  });
}

}
