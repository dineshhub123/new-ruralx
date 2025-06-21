import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';


@Component({
  selector: 'app-dailog',
  templateUrl: './dailog.component.html',
  styleUrls: ['./dailog.component.css']
})
export class DailogComponent implements OnInit {
  //public pinAvail: FormGroup;
  pinAvailToast:boolean=false;
  public pinAvail:any;
  public pinNotAvailToast:boolean=false;
   public pinNotAvail:any;
  submitted:boolean=false;
  public formdata :any;
  constructor(private fb:FormBuilder) { }

  ngOnInit() {
    this.formdata = this.fb.group({
      userPincode: ['', [Validators.required, Validators.maxLength(6)]],
    });

  }
  get f() { return this.formdata.controls; }

  PincodeApply(pin:any){
    console.log("pin")
    this.submitted=true;
    if (this.formdata.valid) {
     if(pin.value==481001             //Balaghat
      ||pin.value==481331             //warasioni
      ||pin.value==481441             //Lalburra
      ||pin.value==481111             //Baihar
      ||pin.value==481051             //Birsa
      ||pin.value==481222             //Lanji
      ||pin.value==481337             //Khairlanji
      ||pin.value==481556             //Parashwada
      ||pin.value==481445             //Katangi
      ||pin.value==481115){           //Kirnapur
      this.pinAvailToast=true;
      this.pinNotAvailToast=false;
      this.pinAvail="Your item is available here "
    }
else{
     this.pinNotAvailToast=true;
     this.pinAvailToast=false;
     this.pinNotAvail="Ohh..! Sorry service is not available on this pincode."
     setTimeout(()=>{
      this.pinNotAvailToast=false;
     },3000)
    }
  }
}
}
