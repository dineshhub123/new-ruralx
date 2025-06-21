import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../api.service';
@Component({
  selector: 'app-useraddress',
  templateUrl: './useraddress.component.html',
  styleUrls: ['./useraddress.component.css']
})
export class UseraddressComponent implements OnInit {
  public addShipTextForm: boolean = false
  public  addCartData: any;
  couponFormControl = new FormControl('');

  public editId: any = Number
  public addressForm: FormGroup;
  public radioForm: FormGroup;
  public editbtn: boolean = false
  public exiestShipment: any = [];
  public loginUserAddress: any = [];
  public selectedAddress = "defaultAddress"
  constructor(private fb: FormBuilder, private apiService: ApiService) {
    let cartItem: any;
    cartItem = localStorage.getItem('cart_items')
    this.addCartData = JSON.parse(cartItem)
    console.log(this.addCartData)
    let userAdd: any
    userAdd = localStorage.getItem("shiping_address")
    this.exiestShipment = JSON.parse(userAdd);
    this.radioForm = new FormGroup({
      radioOption: new FormControl('')
    });

    this.addressForm = this.fb.group({
      fullName: ['', Validators.required],
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      country: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      additionalNotes: ['']
    });
  }
  onSubmitAddress(shipingAddress: any) {
    if (this.addressForm?.valid) {
      if (shipingAddress) {
        let loginUser: any
        loginUser = localStorage.getItem('login_user')
        let user = JSON.parse(loginUser)
        let shippmentPayload = {
          // login user
          login_u_firstname: user.user_first_name,
          login_u_lastname: user.user_last_name,
          login_u_email: user.user_email,
          login_u_phone: user.user_phone,
          login_u_password: user.user_password,
          // shiping address
          shipment_fullname: shipingAddress?.value?.fullName,
          shipment_streetAddress: shipingAddress?.value?.streetAddress,
          shipment_city: shipingAddress?.value?.city,
          shipment_state: shipingAddress?.value?.state,
          shipment_zipcode: shipingAddress?.value?.zipCode,
          shipment_country: shipingAddress?.value?.country,
          shipment_mobile: shipingAddress?.value?.phoneNumber,
          shipment_additonalNote: shipingAddress?.value?.additionalNotes
        }
        this.apiService.insertShippingAddress(shippmentPayload).subscribe((shippmentRes: any) => {
        })
        this.exiestShipment = [{
          shipment_fullname: shipingAddress?.value?.fullName,
          shipment_streetAddress: shipingAddress?.value?.streetAddress,
          shipment_city: shipingAddress?.value?.city,
          shipment_state: shipingAddress?.value?.state,
          shipment_zipcode: shipingAddress?.value?.zipCode,
          shipment_country: shipingAddress?.value?.country,
          shipment_mobile: shipingAddress?.value?.phoneNumber,
          shipment_additonalNote: shipingAddress?.value?.additionalNotes
        }];
        setTimeout(() => {
          this.addShipTextForm = false;
          this.addressForm.reset();
          this.getshipDetails();
        }, 100)
      }
    }
  }
  ngOnInit() {
    this.getshipDetails();
    let userAddress: any;
    userAddress = localStorage.getItem("login_user")
    let address = JSON.parse(userAddress)
    this.loginUserAddress.push(address)
    this.radioForm = new FormGroup({
      radioOption: new FormControl(this.loginUserAddress[0])
    });

  }
  getshipDetails() {
    this.apiService.getShippingAddress().subscribe((res: any) => {
      let userInfo: any;
      userInfo = localStorage.getItem("login_user")
      let user = JSON.parse(userInfo)
      const shipingObj = res?.filter((shipment: any) => (
        shipment.login_user_mobile === user?.user_phone &&
        shipment?.login_user_first_name === user?.user_first_name &&
        shipment?.login_user_email === user?.user_email &&
        shipment?.login_user_password === user?.user_password
      ))
      this.exiestShipment = shipingObj;
    })
  }
  updateShippingAddress(updatedAddress: any) {
    this.editbtn = false;
    let updatePayload = {
      shipment_id: this.editId,
      shipment_fullname: updatedAddress?.value?.fullName,
      shipment_streetAddress: updatedAddress?.value?.streetAddress,
      shipment_city: updatedAddress?.value?.city,
      shipment_state: updatedAddress?.value?.state,
      shipment_zipcode: updatedAddress?.value?.zipCode,
      shipment_country: updatedAddress?.value?.country,
      shipment_mobile: updatedAddress?.value?.phoneNumber,
      shipment_additonalNote: updatedAddress?.value?.additionalNotes
    }
    this.apiService.updateShippingAddress(updatePayload).subscribe((res: any) => { });
    this.addShipTextForm = false;
    this.addressForm.reset();
    setTimeout(() => {
      this.getshipDetails()
    }, 100)
  }
  editShipAddress(ship: any) {
    this.editId = ship?.id
    console.log(ship?.id)
    this.addShipTextForm = true;
    this.editbtn = true;
    this.addressForm.patchValue({
      fullName: ship.shipment_fullname,
      streetAddress: ship.shipment_streetAddress,
      city: ship.shipment_city,
      state: ship.shipment_state,
      zipCode: ship.shipment_zipcode,
      country: ship.shipment_country,
      phoneNumber: ship.shipment_mobile,
      additionalNotes: ship.shipment_additonalNote
    })
  }
  deleteShippingaddress(deleteId: any) {
    let deletePayload = {
      delete_id: deleteId?.id
    }
    this.apiService.deleteShippingAddress(deletePayload).subscribe((res: any) => { })
    setTimeout(() => {
      this.getshipDetails()
    }, 100)

  }
  addShippingAddress() {
    this.addShipTextForm = !this.addShipTextForm;
  }
  confirmOrder() {
    console.log(this.radioForm?.value?.radioOption)
  }
}
