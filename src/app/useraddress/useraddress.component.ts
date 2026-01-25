import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { AddcartService } from '../services/addcart.service';
import { ScrollService } from '../scroll.service';

@Component({
  selector: 'app-useraddress',
  templateUrl: './useraddress.component.html',
  styleUrls: ['./useraddress.component.css']
})
export class UseraddressComponent implements OnInit {
  public addShipTextForm: boolean = false
  public addCartData: any;
  public isLoading:boolean = false;
  couponFormControl = new FormControl('');
  public editId: any = Number
  public addressForm: FormGroup;
  public radioForm: FormGroup;
  public editbtn: boolean = false
  public exiestShipment: any = [];
  public loginUserAddress: any = [];
  public selectedAddress = "defaultAddress"
  public hideHeader:boolean = false;
  lastScrollTop = 0;
  showHeaderAtTop = false;

  constructor(private fb: FormBuilder, private apiService: ApiService, public router: Router ,public addCartService:AddcartService,public scrollService:ScrollService) {
    // let cartItem: any;
    // cartItem = localStorage.getItem('cart_items')
    // let loginUser = JSON.parse(cartItem)
    // this.addCartService.cart$.subscribe((res: any) => {
    // if(res){
    // let  filerCartItem = res.filter((item:any)=>item?.userId === loginUser?.userId)
    // this.addCartData = filerCartItem;
    //   }
    // })
    // console.log("addCartData",this.addCartData)


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
    this.isLoading = true;
    this.getshipDetails();
    let userAddress: any;
    userAddress = localStorage.getItem("login_user")
    let address = JSON.parse(userAddress)
    this.loginUserAddress.push(address)
        console.log(this.loginUserAddress)
    this.addCartService.cart$.subscribe((res: any) => {
    if(res){
    let  filerCartItem = res.filter((item:any)=>item?.userId === address?.userId)
    this.addCartData = filerCartItem;
    this.isLoading = false;
      }
    })
    console.log("addCartData",this.addCartData)

    this.radioForm = new FormGroup({
      radioOption: new FormControl(this.loginUserAddress[0])
    });
this.scrollService.scroll$.subscribe(scrollTop => {
  // Always show header at top
  if (scrollTop <= 0) {
    this.hideHeader = false;
    this.showHeaderAtTop = false;
    return;
  }

  // Scroll down → hide
  if (scrollTop > this.lastScrollTop && scrollTop > 80) {
    this.hideHeader = true;
    this.showHeaderAtTop = true;
  }
  // Scroll up → show
  else if (scrollTop < this.lastScrollTop) {
    this.hideHeader = false;
    this.showHeaderAtTop = false;
  }

  this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
 });
  }
  getshipDetails() {
    this.isLoading = true;
    this.apiService.getShippingAddress().subscribe((res: any) => {
      this.isLoading = false;
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
  calculateOrderAmount(): number {
  return this.addCartData.reduce((total: number, item: any) => {
    const price = Number(item.product_price);
    const qty = Number(item.quantity);
    return total + price * qty;
  }, 0);
}

confirmOrder() {
const user = this.radioForm.get('radioOption')?.value;
const orderPayload = {
  user_id: 1,
  order_amount: this.calculateOrderAmount(),
  payment_method: 'COD',
  order_source: 'APP',

  delivery_address: {
    name: `${user?.user_first_name} ${user?.user_last_name}`.trim(),
    mobile: user?.user_phone,
    address: `${user?.house_no ?? ''}, ${user?.street_area ?? ''}, ${user?.landmark ?? ''}, ${user?.post_office ?? ''}, ${user?.tehsil ?? ''}, ${user?.district ?? ''}, ${user?.state ?? ''}, ${user?.country ?? ''} - ${user?.user_pincode ?? ''}`,
    email:user?.user_email
  },

  items: this.addCartData.map((item: any) => ({
    product_id: item.product_id,
    product_name: item.product_name,
    price: item.product_price,
    mrp: item.product_mrp_price,
    quantity: item.quantity,
    sub_category: item.sub_category,
    category: item.category,
    color: item.color,
    user_id: item.userId,
    image: item.image_url
  }))
};
this.apiService.placeAnOrder(orderPayload).subscribe(res => {
    })
  }
}
