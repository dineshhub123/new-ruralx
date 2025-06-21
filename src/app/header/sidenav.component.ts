import { Component, OnInit,Inject } from '@angular/core';
//import { SidebarJSService } from 'ng-sidebarjs';
import { PlatformLocation,DOCUMENT } from '@angular/common';


declare var $: any;
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document) {
    //console.log(this.sidebarjsService);
   }

  ngOnInit() {
    // document.addEventListener('deviceready', this.backbutton.bind(this));

    document.addEventListener('backbutton', this.closeSidebarNav.bind(this), false);

  }
  public onOpen() {

    this.document.body.classList.add('no-scroll');

    //console.log('open');
  }

  public onClose() {
    this.document.body.classList.remove('no-scroll');

    //console.log('close');
  }

  public onChangeVisibility(event:any) {
   // console.log('change visibility', event);
  }
  closeSidebarNav(){
    this.onClose()
  }
  public closeNav(){
    this.document.body.classList.remove('no-scroll');

  }
}
