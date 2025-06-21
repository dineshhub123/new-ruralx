import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-display-search-item',
  templateUrl: './display-search-item.component.html',
  styleUrls: ['./display-search-item.component.css']
})
export class DisplaySearchItemComponent implements OnInit {
  public searchItem:any;
  public items:any; 
  constructor(public router:Router) { 

  }
  ngOnInit() {
    this.itemInitilize();
  }
  itemInitilize(){
    let data:any;
    data = localStorage.getItem('displaySearchData')
    this.searchItem = JSON.parse(data)
  }
  ngAfterViewInit(){

  }
  imgClick(item:any){
    localStorage.setItem('selected-item',JSON.stringify(item))
    this.router.navigate(['pzoom'])
  }
}

