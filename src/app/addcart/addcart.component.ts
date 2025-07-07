import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { AddcartService } from '../addcart.service';
import { ApiService } from '../api.service';
import { ViewportScroller } from '@angular/common';
import { number } from 'echarts';

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
  constructor(private router: Router, public addCartService: AddcartService, public apiService: ApiService) {
    this.unsubscribe = this.addCartService.cart$.subscribe((res: any) => {
      this.addCartData = res
    })
  }

  ngOnInit() {
    let cartItem: any;
    cartItem = localStorage.getItem('cart_items')
    this.addCartData = JSON.parse(cartItem)
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
    const storedUserString = localStorage.getItem("login_user");
    if (storedUserString) {
      const exiestUser = JSON.parse(storedUserString);
      if (exiestUser) {
        let userBuyerPayload: any = []
        cartData.forEach((item: any, index: number) => {
          console.log("item", item)
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
    } else {
      this.checkUserExiest = true;
      setTimeout(() => {
        this.checkUserExiest = false;
        this.router.navigate(['./login'])
      }, 4000)

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
    let index = diTtem.findIndex((x: any) => x?.id === itemDec?.id)
    let findObj = diTtem.find((x: any) => x?.id === itemDec?.id)
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
    let findObj = diTtem.find((x: any) => x?.id === itemInc?.id)
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
