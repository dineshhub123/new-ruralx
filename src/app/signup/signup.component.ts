import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  constructor(public router:Router,private apiService:ApiService) { }

  ngOnInit() {
  }
  userSignup(userDetails:any){
 let isertUserDetailsPayload = {
  u_firstname : userDetails?.form.value?.firstname,
  u_lastname : userDetails?.form.value?.lastname,
  u_email : userDetails?.form.value?.email,
  u_phone : userDetails?.form.value?.phone,
  u_password : userDetails?.form.value?.password,
  u_address : userDetails?.form.value?.address,
  u_pincode : userDetails?.form.value?.pincode
 }
    this.apiService.insertUserDetails(isertUserDetailsPayload).subscribe(res=>{
     })
     this.router.navigateByUrl('login')

  }
}
