import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-todaydeal',
  templateUrl: './todaydeal.component.html',
  styleUrls: ['./todaydeal.component.css']
})
export class TodaydealComponent implements OnInit {
  fasionItem=[]
  constructor() { }

  ngOnInit() {
  }
  imgClick(ev:any){}

}
