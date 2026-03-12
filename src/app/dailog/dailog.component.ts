import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PincodeService } from '../pincode.service';

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
  constructor(private fb: FormBuilder,public router:Router,public pincodeService:PincodeService, public dialogRef: MatDialogRef<any>,private toastr: ToastrService,

) { }

  ngOnInit() {
    this.formdata = this.fb.group({
      userPincode: ['', [Validators.required, Validators.minLength(6),Validators.maxLength(6),Validators.pattern(/^[0-9]+$/)]],
    });

  }
  get f() { return this.formdata.controls; }

PincodeApply() {
  this.submitted = true;
  if (!this.formdata.valid) {
    return;
  }
  const pin = this.formdata.get('userPincode')?.value;
  const userPin = Number(pin);
  if (!this.pincodeService.isServiceable(userPin)) {
    this.dialogRef.close();
    this.router.navigate(["coming-soon"]);
  } else {
    this.toastr.success(
      "Awesome! You're in a service zone! We're happy to deliver."
    );
    this.dialogRef.close();
  }
}  }

