import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { AddcartService } from '../services/addcart.service';
import { ScrollService } from '../scroll.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AddressService } from '../address.service';
import { LoginService } from '../services/login.service';
import { RazorpayService } from '../razorpay.service';
import { PaymentApiService } from '../payment-api.service';

@Component({
  selector: 'app-useraddress',
  templateUrl: './useraddress.component.html',
  styleUrls: ['./useraddress.component.css']
})
export class UseraddressComponent implements OnInit {
  public addShipTextForm: boolean = false
  public addCartData: any;
  public isLoading: boolean = false;
  couponFormControl = new FormControl('');
  public editId: any = Number
  public addressForm: FormGroup;
  public radioForm: FormGroup;
  public editbtn: boolean = false
  public exiestShipment: any = [];
  public loginUserAddress: any = [];
  public selectedAddress = "defaultAddress"
  public hideHeader: boolean = false;
  lastScrollTop = 0;
  showHeaderAtTop = false;
  public user: any = null;
  public addressList: any[] = [];
  public totalMrp: any;
  public totalAmount: any;
  public totalDiscount: any;

  constructor(private razorpay: RazorpayService,
    private paymentApi: PaymentApiService,
    private fb: FormBuilder, public loginService: LoginService, public addressService: AddressService, private dialog: MatDialog, public toastr: ToastrService, private apiService: ApiService, public router: Router, public addCartService: AddcartService, public scrollService: ScrollService) {
    let loginUserStr = localStorage.getItem('login_user');
    if (loginUserStr) {
      this.user = JSON.parse(loginUserStr);
    }
    let userAdd: any
    userAdd = localStorage.getItem("shiping_address")
    this.exiestShipment = JSON.parse(userAdd);
    this.radioForm = new FormGroup({
      radioOption: new FormControl('')
    });

    this.addressForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      house_no: ['', [Validators.required]],
      street_area: ['', [Validators.required]],
      landmark: ['', [Validators.required]],
      post_office: ['', [Validators.required]],
      tehsil: ['', [Validators.required]],
      district: ['', [Validators.required]],
      state: ['Madhya Pradesh', [Validators.required]],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      country: ['India', [Validators.required]],

    });
  }

  get f() { return this.addressForm.controls; }


  onSubmitAddress() {
    try {
      this.isLoading = true;
      if (this.addressForm.invalid) {
        this.addressForm.markAllAsTouched();
        return;
      }
      const formValue = this.addressForm.value;
      const payload = {
        user_id: this.user?.userId,
        full_name: formValue.fullName,
        user_phone: formValue.phone,
        user_email: formValue.email,
        house_no: formValue.house_no,
        street_area: formValue.street_area,
        landmark: formValue.landmark,
        post_office: formValue.post_office,
        tehsil: formValue.tehsil,
        district: formValue.district,
        state: formValue.state,
        country: formValue.country,
        user_pincode: formValue.pincode,
        address_type: "shipping",
        is_default: 0
      };
      // API Call here
      this.apiService.insertShippingAddress(payload).subscribe((res: any) => {
        if (res?.status) {
          this.isLoading = false;
          this.addShipTextForm = false;
          this.addressForm.reset();
          this.toastr.success(res?.message)
          this.loadAddresses();
        }
      })
    } catch (err) {
      this.isLoading = false;
      console.error(err)
    }
  }

  ngOnInit() {
    this.loadAddresses();
    let userAddress: any;
    userAddress = localStorage.getItem("login_user")
    let address = JSON.parse(userAddress)
    this.loginUserAddress.push(address)
    this.addCartService.cart$.subscribe((res: any) => {
      if (res) {
        let filerCartItem = res.filter((item: any) => item?.userId === address?.userId)
        this.addCartData = filerCartItem;
        const totals = this.calculateTotals(this.addCartData)
        console.log("Total MRP:", totals.totalMrp);
        console.log("Total Price:", totals.totalPrice);
        console.log("Total Discount:", totals.totalDiscount);

        this.totalMrp = totals.totalMrp;
        this.totalAmount = totals.totalPrice;
        this.totalDiscount = totals.totalDiscount;
      }
    })

    this.addressService.selectedAddress$.subscribe((addr: any) => {
      if (!addr) return;
      const sameRef = this.loginUserAddress?.find((x: any) => x?.id == addr?.id);
      const shipRef = this.addressList?.find((x: any) => x?.id == addr?.id);
      this.radioForm.patchValue({ radioOption: sameRef ?? shipRef ?? null });
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


  calculateTotals(cart: any[]) {
    const totals = cart.reduce(
      (acc: any, item: any) => {
        const qty = Number(item.quantity || 1);

        const mrp = Number(item.product_mrp_price || 0);
        const price = Number(item.product_price || 0);

        acc.totalMrp += mrp * qty;
        acc.totalPrice += price * qty;
        acc.totalDiscount += (mrp - price) * qty;

        return acc;
      },
      { totalMrp: 0, totalPrice: 0, totalDiscount: 0 }
    );

    return totals;
  }


  loadAddresses() {
    this.isLoading = true;
    this.apiService.getShippingAddressByUserId(this.user.userId).subscribe({
      next: (res: any) => {
        if (res?.status) {
          this.isLoading = false;
          this.addressList = res.data;
          this.setDefaultRadio();
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
      }
    });
  }
  setDefaultRadio() {
    const selectedAddr = this.addressService.getSelectedAddress();
    if (!selectedAddr) return;
    const sameRef = this.loginUserAddress?.find((x: any) => x?.id == selectedAddr?.id);
    const shipRef = this.addressList?.find((x: any) => x?.id == selectedAddr?.id);
    this.radioForm.patchValue({ radioOption: sameRef ?? shipRef ?? null });
  }


  updateShippingAddress(updatedAddress: any) {
    try {
      this.editbtn = false;
      const payload = {
        id: this.editId,
        user_id: this.user?.userId,
        full_name: updatedAddress?.value?.fullName,
        user_phone: updatedAddress?.value?.phone,
        user_email: updatedAddress?.value?.email,
        house_no: updatedAddress?.value?.house_no,
        street_area: updatedAddress?.value?.street_area,
        landmark: updatedAddress?.value?.landmark,
        post_office: updatedAddress?.value?.post_office,
        tehsil: updatedAddress?.value?.tehsil,
        district: updatedAddress?.value?.district,
        state: updatedAddress?.value?.state,
        country: updatedAddress?.value?.country,
        user_pincode: updatedAddress?.value?.pincode,
        address_type: "shipping",
        is_default: 0
      };
      this.apiService.updateShippingAddress(payload).subscribe((res: any) => {
        if (res?.status) {
          this.addShipTextForm = false;
          this.addressForm.reset();
          this.toastr.success(res?.message)
          this.loadAddresses();
        }
      });
    } catch (err) {
      console.log(err)
    }
  }

  editShipAddress(ship: any) {
    this.editId = ship?.id
    this.addShipTextForm = true;
    this.editbtn = true;
    this.addressForm.patchValue({
      fullName: ship.full_name,
      email: ship.user_email,
      phone: ship.user_phone,
      house_no: ship.house_no,
      street_area: ship.street_area,
      landmark: ship.landmark,
      post_office: ship.post_office,
      tehsil: ship.tehsil,
      district: ship.district,
      state: ship.state,
      pincode: ship.user_pincode,
      country: ship.country
    });
  }
  deleteShippingaddress(deleteId: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: "Are you sure want to delete this Address?" }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.isLoading = true;
      const deletePayload = {
        id: deleteId.id,
        user_id: this.user?.userId
      };
      this.apiService.deleteShippingAddress(deletePayload).subscribe((res: any) => {
        this.isLoading = false;
        if (res?.status) {
          this.loadAddresses();
          this.toastr.success(res?.message);
        } else {
          this.toastr.error(res?.message || "Delete failed");
        }
      }, () => {
        this.isLoading = false;
        this.toastr.error("Server error");
      });
    })
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

  // confirmOrder() {
  //   try {
  //     this.isLoading = true;
  //     const user = this.radioForm.get('radioOption')?.value;
  //     const orderPayload = {
  //       user_id: 1,
  //       order_amount: this.calculateOrderAmount(),
  //       payment_method: 'netbanking',
  //       order_source: 'APP',
  //       delivery_address: {
  //         name: (user?.full_name ? user.full_name : `${user?.user_first_name ?? ''} ${user?.user_last_name ?? ''}`.trim()),
  //         mobile: user?.user_phone,
  //         address: `${user?.house_no ?? ''}, ${user?.street_area ?? ''}, ${user?.landmark ?? ''}, ${user?.post_office ?? ''}, ${user?.tehsil ?? ''}, ${user?.district ?? ''}, ${user?.state ?? ''}, ${user?.country ?? ''} - ${user?.user_pincode ?? ''}`,
  //         email: user?.user_email
  //       },
  //       items: this.addCartData.map((item: any) => ({
  //         product_id: item.product_id,
  //         product_name: item.product_name,
  //         price: item.product_price,
  //         mrp: item.product_mrp_price,
  //         quantity: item.quantity,
  //         sub_category: item.sub_category,
  //         category: item.category,
  //         color: item.color,
  //         user_id: item.userId,
  //         image: item.image_url
  //       }))
  //     };
  //     this.apiService.placeAnOrder(orderPayload).subscribe(res => {
  //       if (res?.status) {
  //         this.isLoading = false;
  //       }
  //     })
  //   } catch (err) {
  //     this.isLoading = false;
  //     console.error(err)
  //   }
  // }
  onAddressSelect(user: any) {
    this.radioForm.patchValue({ radioOption: user });
    const selectedAddress = this.radioForm.value.radioOption;
    this.addressService.setSelectedAddress(selectedAddress);
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }

  // pay() {
  //   if ((window as any).Android) {
  //     (window as any).Android.startPayment(this.totalAmount);
  //     return;
  //   }
  //   this.webPay();
  // }

  // async webPay() {
  //   await this.razorpay.loadScript();
  //   const amountInPaise = Math.round(this.totalAmount * 100);
  //   this.paymentApi.createOrder(amountInPaise).subscribe(order => {
  //     const options = {
  //       amount: amountInPaise,
  //       currency: 'INR',
  //       name: 'Ruralx Test',
  //       description: 'Test Payment',
  //       order_id: order.order_id,
  //       method: {
  //         upi: true,
  //         card: true,
  //         netbanking: true,
  //         wallet: false,
  //         emi: false,
  //         paylater: false,
  //         cred: false
  //       },
  //       handler: (response: any) => {
  //         this.verify(response);
  //       }
  //     };

  //     this.razorpay.openCheckout(options);
  //   });
  // }


  // verify(response: any) {
  //   this.paymentApi.verifyPayment(response)
  //     .subscribe(res => {
  //       console.log('Payment result:', res);
  //     });
  // }







  async confirmOrder() {
  try {
    if ((window as any).Android) {
      (window as any).Android.startPayment(this.totalAmount);
      return;
    }

    //this.isLoading = true;
    const user = this.radioForm.get('radioOption')?.value;
    const orderPayload = {
      user_id: 1,
      order_amount: this.calculateOrderAmount(),
      payment_method: 'ONLINE',
      order_source: 'APP',
      delivery_address: {
        name: (user?.full_name ? user.full_name :
          `${user?.user_first_name ?? ''} ${user?.user_last_name ?? ''}`.trim()),
        mobile: user?.user_phone,
        address: `${user?.house_no ?? ''}, ${user?.street_area ?? ''},
        ${user?.landmark ?? ''}, ${user?.post_office ?? ''},
        ${user?.tehsil ?? ''}, ${user?.district ?? ''},
        ${user?.state ?? ''}, ${user?.country ?? ''} - ${user?.user_pincode ?? ''}`,
        email: user?.user_email
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
    await this.razorpay.loadScript();
    const amountInPaise = Math.round(orderPayload.order_amount * 100);

    // 🔥 STEP 1 → CREATE RAZORPAY ORDER
    this.paymentApi.createOrder(amountInPaise).subscribe(order => {
    this.isLoading = false;

      this.openRazorpay(order, orderPayload, amountInPaise);

    });

  } catch (err) {
    this.isLoading = false;
    console.error(err);
  }
}

openRazorpay(order: any, orderPayload: any, amountInPaise: number) {
  const options: any = {
    key: 'rzp_test_S8zVFIrjVuV97p',
    amount: amountInPaise,
    currency: 'INR',
    name: 'Ruralx',
    description: 'Order Payment',
    order_id: order.order_id,

    method: {
      upi: true,
      card: true,
      netbanking: true,
      wallet: false,
      emi: false,
      paylater: false,
      cred: false
    },

    handler: (response: any) => {

      // ✅ VERIFY PAYMENT
      this.verifyPayment(response, orderPayload);

    },

    prefill: {
      name: orderPayload.delivery_address.name,
      email: orderPayload.delivery_address.email,
      contact: orderPayload.delivery_address.mobile
    }
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
}
verifyPayment(response: any, orderPayload: any) {
      this.apiService.placeAnOrder(orderPayload).subscribe(res => {
        this.isLoading = false;
        if (res?.status) {
          alert("Order Placed Successfully");
        }
      });

  // this.paymentApi.verifyPayment(response).subscribe(verifyRes => {
  //   if (verifyRes?.status) {

  //     // ✅ PAYMENT VERIFIED → NOW SAVE ORDER
  //     this.apiService.placeAnOrder(orderPayload).subscribe(res => {

  //       this.isLoading = false;

  //       if (res?.status) {
  //         alert("Order Placed Successfully");
  //       }

  //     });

  //   } else {
  //     this.isLoading = false;
  //     alert("Payment Verification Failed");
  //   }

  // });
}

}
