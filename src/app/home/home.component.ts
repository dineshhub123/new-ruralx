import { Component,Inject} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DailogComponent } from '../dailog/dailog.component';
import { ApiService } from '../api.service';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';

export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
  export class HomeComponent {
  data:any;
  zoomId:any;
  searchName:string="";
  quantity:any;
 public name:any
 public animal:any
  public formdata:any
  constructor(private http: HttpClient,private router:Router,public dialog: MatDialog, private apiService:ApiService,private fb:FormBuilder) {
      
    this.http.get("http://192.168.43.205/employee.php").subscribe(data => {
    this.data.push(data);
    }, 
    error => console.error(error));
  }
  // openDialog(): void {
  //   const dialogRef = this.dialog.open(DailogComponent, {
  //     width: '250px',
  //     data: {name: this.name, animal: this.animal}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //     this.animal = result;
  //   });
  // }


  get f() { return this.formdata.controls; }
  ngOnInit(){

    // document.addEventListener('backbutton', this.closeOverlay.bind(this), true);
    this.formdata = this.fb.group({
      userPincode: ['', [Validators.required, Validators.maxLength(6)]],
    });


    this.quantity= localStorage.getItem('quantity')
    if (this.quantity==null){
      this.quantity=0;
      }
  
  }
  cartFun(){
    this.router.navigate(['addcart'])
  }

generate(){
  let num = "1234567890";
  let OTP="";
  for(let i=0; i<6;i++){
  OTP+=num[Math.floor(Math.random()*10)];
}

//document.getElementById("otpDisplay").innerHTML=OTP;

}
fetchData(){
  //  let res=this.apiService.employeeData().subscribe(
  //   res => {
  //    alert(JSON.stringify(res[0].product_name))
  //   })
 }

}

  