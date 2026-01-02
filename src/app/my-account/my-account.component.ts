import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent {
  constructor(private location: Location){}
}
