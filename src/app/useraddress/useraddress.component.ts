import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { NgZone } from '@angular/core';
import { CodConfirmDialogComponent } from '../cod-confirm-dialog/cod-confirm-dialog.component';
import { PincodeService } from '../pincode.service';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-useraddress',
  templateUrl: './useraddress.component.html',
  styleUrls: ['./useraddress.component.css']
})
export class UseraddressComponent implements OnInit {
  @ViewChild('fullNameInput')
  fullNameInput!: ElementRef<HTMLInputElement>;
  public addShipTextForm: boolean = false
  public userCheckOutData: any;
  public isLoading: boolean = false;
  public isPaymentLoading: boolean = false;
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
  public selectedPaymentMethod: string = 'ONLINE'; // default
  constructor(private razorpay: RazorpayService,
    private paymentApi: PaymentApiService, private ngZone: NgZone,
    private fb: FormBuilder, public loginService: LoginService, public pincodeService: PincodeService, public addressService: AddressService, private dialog: MatDialog, public toastr: ToastrService, private apiService: ApiService, public router: Router, public addCartService: AddcartService, public scrollService: ScrollService) {
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
    this.loadCheckoutData();
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
  loadCheckoutData() {
    const stored = localStorage.getItem('checkout_data');

    if (stored) {
      // ✅ BUY NOW FLOW
      this.userCheckOutData = JSON.parse(stored);

    } else {
      // ✅ CART FLOW
      this.addCartService.cart$.subscribe(cart => {
        this.userCheckOutData = cart;
      });
    }

    const totals = this.calculateTotals(this.userCheckOutData);
    this.totalMrp = totals.totalMrp;
    this.totalAmount = totals.totalPrice;
    this.totalDiscount = totals.totalDiscount;

  }

  ngOnDestroy() {
    localStorage.removeItem('checkout_data');
  }

  buildOrderItems(items: any[]) {
    return items.map((item: any) => ({
      product_id: item.product_id,
      product_name: item.product_name,
      price: item.price,
      mrp: item.mrp,
      quantity: item.quantity,
      sub_category: item.sub_category,
      category: item.category,
      color: item.color,
      // user_id: item.userId,
      image: item.image,
      size: item.size || "",
      gst_rate: item.gst_rate,
      hsn_code: item.hsn_code
    }));
  }

  calculateTotals(cart: any[]) {
    const totals = cart.reduce(
      (acc: any, item: any) => {
        const qty = Number(item.quantity || 1);
        const mrp = Number(item.mrp || 0);
        const price = Number(item.price || 0);
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
    window.scroll({
      top: 0,
      behavior: 'smooth'
    });
    // Focus first field after scroll
    setTimeout(() => {
      this.fullNameInput.nativeElement.focus();
    }, 500);

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
    if (!this.userCheckOutData || this.userCheckOutData.length === 0) {
      throw new Error('Cart data is empty');
    }
    return this.userCheckOutData.reduce((total: number, item: any, index: number) => {
      const price = Number(item.price);
      const qty = Number(item.quantity);
      // validation
      if (isNaN(price) || isNaN(qty)) {
        throw new Error(`Invalid price or quantity at index ${index}`);
      }
      return total + price * qty;
    }, 0);
  }
  onAddressSelect(user: any) {
    this.radioForm.patchValue({ radioOption: user });
    const selectedAddress = this.radioForm.value.radioOption;
    this.addressService.setSelectedAddress(selectedAddress);
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }

  confirmOrder() {
    if (this.selectedPaymentMethod === 'ONLINE') {
      this.placeOnlineOrder();
    }
    else if (this.selectedPaymentMethod === 'COD') {
      const dialogRef = this.dialog.open(CodConfirmDialogComponent, {
        width: '500px',
        maxWidth: '85vw',
        maxHeight: '90vh',
        data: { amount: this.calculateOrderAmount() }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.placeCodOrder();
        }
      });
    }
  }
  async placeCodOrder() {
    try {
      this.isPaymentLoading = true;
      let orderItems = this.buildOrderItems(this.userCheckOutData);
      const user = this.radioForm.get('radioOption')?.value;
      const pin = Number(user?.user_pincode);
      const pincodeResponse = await firstValueFrom(
        this.pincodeService.checkPincode(pin)
      );
      if (!pincodeResponse.serviceable) {
        this.router.navigate(["coming-soon"]);
        return;
      }

      const orderPayload = {
        order_amount: this.calculateOrderAmount(),
        payment_method: 'COD',
        payment_status: 'PENDING',
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
        items: orderItems,
      };
      this.apiService.placeAnOrder(orderPayload).subscribe({
        next: (res) => {
          this.isPaymentLoading = false;

          if (res) {
            this.addCartService.loadCartFromAPI();
            this.addCartService.clearBuyNowItem();
            this.loadCheckoutData();
            this.router.navigate(['/order-confirmed']);
          }
        },
        error: (err) => {
          this.isPaymentLoading = false;
          console.error(err);
        }
      });

    } catch (err) {
      this.isPaymentLoading = false;
      console.error(err);
    }
  }

  async placeOnlineOrder() {
    try {
      if ((window as any).Android) {
        (window as any).Android.startPayment(this.totalAmount);
        return;
      }
      let orderItems;
      orderItems = this.buildOrderItems(this.userCheckOutData);
      const user = this.radioForm.get('radioOption')?.value;
      const pin = Number(user?.user_pincode);
      const pincodeResponse = await firstValueFrom(
        this.pincodeService.checkPincode(pin)
      );
      if (!pincodeResponse.serviceable) {
        this.router.navigate(["coming-soon"]);
        return;
      }
      const orderPayload = {
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
        items: orderItems,
      };
      await this.razorpay.loadScript();
      const amountInPaise = Math.round(orderPayload.order_amount * 100);
      this.paymentApi.createOrder(amountInPaise).subscribe(order => {
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
    this.ngZone.run(() => {
      this.isPaymentLoading = true;
    });
    this.apiService.placeAnOrder(orderPayload).subscribe(res => {
      this.ngZone.run(() => {
        this.isPaymentLoading = false;
        if (res) {
          this.addCartService.loadCartFromAPI();
          this.addCartService.clearBuyNowItem();
          this.loadCheckoutData();
          this.router.navigate(['/order-confirmed']);
        }
      })
    });

  }

}
