import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { AddcartService } from '../addcart.service';
import { ApiService } from '../api.service';
import { ViewportScroller } from '@angular/common';
import { number } from 'echarts';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addcart',
  templateUrl: './addcart.component.html',
  styleUrls: ['./addcart.component.css']
})
export class AddcartComponent implements OnInit {
  addCartData: any;
  totalAmount: any
  unsubscribe: any;
  public counter: number = 1;
  checkUserExiest: boolean = false;
  constructor(private router: Router, public addCartService: AddcartService, public apiService: ApiService,public toastr:ToastrService) {
    let user:any;
    user = localStorage.getItem("login_user")
    let loginUser = JSON.parse(user)
    this.unsubscribe = this.addCartService.cart$.subscribe((res: any) => {
    if(res){
    let  filerCartItem = res.filter((item:any)=>item?.userId === loginUser?.userId)
    this.addCartData = filerCartItem;
      }
    })
  }

  ngOnInit() {
    let cartItem: any;
    let user:any;
    user = localStorage.getItem("login_user")
    let loginUser = JSON.parse(user)
    cartItem = localStorage.getItem('cart_items')
    let addCartData = JSON.parse(cartItem)
    let filerCartItem = addCartData.filter((item:any)=>item?.userId === loginUser?.userId)
    this.addCartData = filerCartItem;
    let totalAmount = this.addCartData.map((total: any) => total.product_price * total.quantity)
    this.totalAmount = totalAmount.reduce((a: any, b: any) => a + b, 0)
  }
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  proceedBuyItem(cartData: []) {
    let storedUserString:any
     storedUserString = localStorage.getItem("login_user");
      const exiestUser = JSON.parse(storedUserString);
      if (exiestUser && !exiestUser?.isGuest) {
        let userBuyerPayload: any = []
        cartData.forEach((item: any, index: number) => {
          const cart = {
            u_firstname: exiestUser?.user_first_name,
            u_lastname: exiestUser?.user_last_name,
            u_email: exiestUser?.user_email,
            u_phone: exiestUser?.user_phone,
            u_password: exiestUser?.user_password,
            u_address: exiestUser?.user_address,
            u_pincode: exiestUser?.user_pincode,
            p_name: item?.product_name,
            p_price: item?.product_price,
            p_mrp: item?.product_mrp_price,
            p_discount: item?.product_discount,
            delivery_date: item?.delivery_date,
            image_front: item?.img_front,
            p_category: item?.category,
            p_quantity: item?.quantity,
            p_buy_time: "12:45:22",
            p_description: item?.product_description
          }
          userBuyerPayload.push(cart)
          console.log(userBuyerPayload)
        })
        this.apiService.ProductBuyerDetails(userBuyerPayload).subscribe(res => {
        })
        this.router.navigate(['./useraddress'])
      }
     else {
      this.toastr.error('Sorry you are a Guest User! Please Login first then continue shoping...');
      setTimeout(() => {
        this.router.navigate(['./login'])
      }, 500)

    }

  }

  ngOnDestroy() {
    this.unsubscribe.next()
    this.unsubscribe.complete();
  }

  decrement(itemDec: any) {
    let deleteItem: any = {};
    deleteItem = localStorage.getItem('cart_items')
    let diTtem = JSON.parse(deleteItem)
    let index = diTtem.findIndex((x: any) => x?.id === itemDec?.id && x?.userId === itemDec?.userId)
    let findObj = diTtem.find((x: any) => x?.id === itemDec?.id && x?.userId === itemDec?.userId)
    let updatedQuantity = findObj?.quantity
    updatedQuantity--
    findObj["quantity"] = updatedQuantity
    if (updatedQuantity == 0) {
      diTtem.splice(index, 1)
    }
    localStorage.setItem('cart_items', JSON.stringify(diTtem))
    this.addCartService.removeCart();
    setTimeout(() => {
      this.reloadCurrentRoute();
    }, 5)


  }
  increment(itemInc: any) {
    let deleteItem: any = {};
    deleteItem = localStorage.getItem('cart_items')
    let diTtem = JSON.parse(deleteItem)
    let findObj = diTtem.find((x: any) => x?.id === itemInc?.id && x?.userId === itemInc?.userId)
    let updatedQuantity = findObj?.quantity
    updatedQuantity += 1
    findObj["quantity"] = updatedQuantity
    localStorage.setItem('cart_items', JSON.stringify(diTtem))
    this.addCartService.removeCart();
    setTimeout(() => {
      this.reloadCurrentRoute();
    }, 5)

  }
}
