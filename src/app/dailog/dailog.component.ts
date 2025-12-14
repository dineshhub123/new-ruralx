import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dailog',
  templateUrl: './dailog.component.html',
  styleUrls: ['./dailog.component.css']
})
export class DailogComponent implements OnInit {
  //public pinAvail: FormGroup;
  pinAvailToast: boolean = false;
  public pinAvail: any;
  public pinNotAvailToast: boolean = false;
  public pinNotAvail: any;
  submitted: boolean = false;
  public formdata: any;
  constructor(private fb: FormBuilder,public router:Router,public dialogRef: MatDialogRef<any>,private toastr: ToastrService,

) { }

  ngOnInit() {
    this.formdata = this.fb.group({
      userPincode: ['', [Validators.required, Validators.minLength(6),Validators.maxLength(6),Validators.pattern(/^[0-9]+$/)]],
    });

  }
  get f() { return this.formdata.controls; }

  PincodeApply(pin: any) {
    this.submitted = true;
    if (this.formdata.valid) {
       if (pin.value == 481001             //Balaghat
        || pin.value == 481331             //warasioni
        || pin.value == 481441             //Lalburra
        || pin.value == 481111             //Baihar
        || pin.value == 481051             //Birsa
        || pin.value == 481222             //Lanji
        || pin.value == 481337             //Khairlanji
        || pin.value == 481556             //Parashwada
        || pin.value == 481445             //Katangi
        || pin.value == 481115) {           //Kirnapur
        this.dialogRef.close();
        this.toastr.success("Awesome! You're in a service zone! We're happy to deliver.");

      }
      else {
         // 1️⃣ Close Dialog
      this.dialogRef.close();

      // 2️⃣ Navigate to Coming Soon
      this.router.navigateByUrl('/coming-soon');      
    }
      }
    }
  }

