import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpEventType } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.css']
})
export class AdminpanelComponent implements OnInit {
  public data:any;
  public retrieveResonse:any;
  public base64Data:any;
  public retrievedImage:any;
  public imageUrl = null;
  public selectedFile:any;
  public sellItemData:any
  public buyerUsername: any;
 public getNotifyUserArray:any;

  

  constructor(private http:HttpClient,private _DomSanitizationService:DomSanitizer,public router:Router, public apiService: ApiService) { 

    this.http.get("http://192.168.43.205/employee.php",{ responseType: 'blob' }).subscribe((res:any) => {
      
    //console.log(res)
    this.data.push(res);
      //console.log(this.data[0][0].img_top)
      }, 
      error => console.error(error));
  
  }

  ngOnInit() {
     this.userlist()
  }

  onSelectFile(event:any){
    this.selectedFile=event.target.files[0];
    console.log(this.selectedFile)
  
    }
;
uploadFormData(){
const uploadData= new FormData();
      uploadData.append("file", this.selectedFile,this.selectedFile.name)
     this.http.post("http://localhost/admin-ruralx/uploadAdminData.php",uploadData,{
     reportProgress:true,
     observe:'events'  
     }).subscribe((res:object) => {
     this.data.push(res);
     console.log(res)
    })

  }
  notification(){
    this.router.navigate(["sell-notification"]);
  }
  upload(){
    this.router.navigate(["upload"]);
  }
  adminLogout(){
    localStorage.removeItem('adminMobile');
    this.router.navigate(["dashboard"]);
  }

  userlist() {
    this.apiService.getUserBuyerDetails().subscribe((Response: any) => {
     this.sellItemData = Response
     let userlistData=this.sellItemData.map((item: any) => 
     item.user_first_name)
     let removeDuplicates=new Set(userlistData)
     this.buyerUsername=[...removeDuplicates];
    this.getNotifyUserArray = []; 
     for (let i = 0; i < this.buyerUsername.length; i++) {
    let  getNotifyUser=this.sellItemData.find((item:any) => item.user_first_name=== this.buyerUsername[i])
    if (getNotifyUser) {
    this.getNotifyUserArray.push(getNotifyUser);
  }
   
    }
});}


  openNotification() {

  }

  closeNotification() {
    
  }

}



