import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AddcartService } from '../services/addcart.service';
import { Product } from '../product-zoom/product-zoom.component';
import { LoginService } from '../services/login.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public itemQuantity: number = 0;
  public cartItems: Product[] = [];

  constructor(public router: Router, public location: Location,
     public addCartService: AddcartService, public loginService: LoginService,
    ) { }

  ngOnInit() {
  this.addCartService.cart$.subscribe(cart => {
   // this.itemQuantity = cart.length;
     this.itemQuantity = cart.reduce((total: number, item: any) => total + (item?.quantity || 0), 0);

  });
  }

  calculateUserCartQuantity(loginUser: any) {
    this.addCartService.cart$.subscribe(items => {
      const userCartItems = items.filter((item: any) => item?.userId === loginUser?.userId);
      this.cartItems = userCartItems;
      let filerCartItems = userCartItems.filter((item: any) => item?.userId === loginUser?.userId)
      this.itemQuantity = filerCartItems.reduce((total: number, item: any) => total + (item?.quantity || 0), 0);
    });

  }
  cartFun() {
    this.router.navigate(['addcart'])
  }


//   back(): void {
//   this.backButtonService.triggerBack();  
// }
}
