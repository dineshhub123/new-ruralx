import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { LoginService } from '../services/login.service';
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent {
  useremail:any;
  username:any;
  isGuest:boolean = true;
  constructor(private location: Location, private loginService:LoginService){
        this.loginService.user$.subscribe(user => {
      if (!user || user.user_first_name === 'Guest') {
        this.useremail = '';
        this.username = 'Unkonown User';
        this.isGuest = true;
      } else {
        this.useremail = user.user_email;
         this.username = user.user_first_name + " " + user.user_last_name;
        this.isGuest = false;
      }
    });  

  }
}
