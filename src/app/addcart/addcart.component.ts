import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { AddcartService } from '../services/addcart.service';
import { ApiService } from '../services/api.service';
import { ViewportScroller } from '@angular/common';
import { number } from 'echarts';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
@Component({
  selector: 'app-addcart',
  templateUrl: './addcart.component.html',
  styleUrls: ['./addcart.component.css']
})
export class AddcartComponent implements OnInit {
  imageBaseUrl = environment.imageBaseUrl;
  addCartData: any;
  totalAmount: any
  unsubscribe: any;
  showCartItems:boolean = true;
  public counter: number = 1;
  checkUserExiest: boolean = false;
  public isLoading: boolean = false;
  MAX_QTY = 4;
  constructor(private router: Router, public addCartService: AddcartService, public apiService: ApiService, public toastr: ToastrService) {
    let user: any;
    user = localStorage.getItem("login_user")
    let loginUser = JSON.parse(user)
    this.isLoading = true;
    this.unsubscribe = this.addCartService.cart$.subscribe((res: any) => {
      if (res) {
        let filerCartItem = res.filter((item: any) => item?.userId === loginUser?.userId)
        this.isLoading = false;
        this.addCartData = filerCartItem;
      }
    })
  }
  ngOnInit() {
    this.addCartService.cart$.subscribe((cart) => {
      let cartItems = cart;
      if (cartItems) {
        this.addCartData = cartItems;
        let totalAmount = this.addCartData.map((total: any) => total.price * total.quantity)
        this.totalAmount = totalAmount.reduce((a: any, b: any) => a + b, 0)
      this.showCartItems = false;
      setTimeout(() => {
        this.showCartItems = true;
      },0);

      }
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  proceedBuyItem(cartData: []) {
    let storedUserString: any
    storedUserString = localStorage.getItem("login_user");
    const exiestUser = JSON.parse(storedUserString);
    if (exiestUser && !exiestUser?.isGuest) {
      localStorage.removeItem('checkout_data');
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

decrement(item: any) {
  const newQty = item.quantity - 1;
  this.addCartService.updateQuantity(item, newQty).subscribe((res: any) => {
    this.addCartService.loadCartFromAPI();
  });
}

increment(item: any) {
  console.log(item)
  if (item.quantity < this.MAX_QTY) {
  const newQty = item.quantity + 1;
  this.addCartService.updateQuantity(item, newQty).subscribe(() => {
    this.addCartService.loadCartFromAPI();
  });
}
}

  updatedQuantity: any;
  
  // decrement(itemDec: any) {
  //   let deleteItem: any = {};
  //   deleteItem = localStorage.getItem('cart_items')
  //   let diTtem = JSON.parse(deleteItem)
  //   let index = diTtem.findIndex((x: any) => x?.id === itemDec?.id && x?.userId === itemDec?.userId && x.color === itemDec.color)
  //   let findObj = diTtem.find((x: any) => x?.id === itemDec?.id && x?.userId === itemDec?.userId && x.color === itemDec.color)
  //   let updatedQuantity = findObj?.quantity
  //   updatedQuantity--
  //   findObj["quantity"] = updatedQuantity
  //   if (updatedQuantity == 0) {
  //     diTtem.splice(index, 1)
  //   }
  //   localStorage.setItem('cart_items', JSON.stringify(diTtem))
  //   // this.addCartService.removeCart(2);
  //   setTimeout(() => {
  //     this.reloadCurrentRoute();
  //   }, 5)


  // }

  // increment(itemInc: any) {
  //   let deleteItem: any = {};
  //   deleteItem = localStorage.getItem('cart_items')
  //   let diTtem = JSON.parse(deleteItem)
  //   let findObj = diTtem.find((x: any) => x?.id === itemInc?.id && x?.userId === itemInc?.userId && x.color === itemInc.color)
  //   this.updatedQuantity = findObj?.quantity
  //   if (this.updatedQuantity < this.MAX_QTY) {
  //     this.updatedQuantity += 1
  //   }
  //   findObj["quantity"] = this.updatedQuantity
  //   localStorage.setItem('cart_items', JSON.stringify(diTtem))
  //   //this.addCartService.removeCart();
  //   setTimeout(() => {
  //     this.reloadCurrentRoute();
  //   }, 5)

  // }
  flyToCart(productImg: HTMLElement) {
    const cartIcon = document.getElementById('cartIconTarget');
    if (!cartIcon || !productImg) return;
    const imgClone = productImg.cloneNode(true) as HTMLElement;
    imgClone.classList.add('fly-img');
    document.body.appendChild(imgClone);
    const start = productImg.getBoundingClientRect();
    const end = cartIcon.getBoundingClientRect();

    // start position
    imgClone.style.left = start.left + 'px';
    imgClone.style.top = start.top + 'px';
    imgClone.style.width = start.width + 'px';
    imgClone.style.height = start.height + 'px';
    imgClone.style.borderRadius = '18px';
    // center of cart icon
    const xMove =
      end.left + end.width / 2 - (start.left + start.width / 2);
    const yMove =
      end.top + end.height / 2 - (start.top + start.height / 2);

    requestAnimationFrame(() => {
      imgClone.style.transform =
        `translate(${xMove}px, ${yMove}px) scale(0.15)`;
      imgClone.style.opacity = '0';
    });
    /* ✨ CART GLOW */
    cartIcon.classList.add('cart-glow', 'cart-bounce');
    setTimeout(() => {
      cartIcon.classList.remove('cart-glow', 'cart-bounce');
    }, 600);

    setTimeout(() => imgClone.remove(), 700);
  }
  flyToCartFromEvent(event: MouseEvent) {
    if (this.updatedQuantity >= this.MAX_QTY) {
      return;
    }

    const target = event.currentTarget as HTMLElement;

    // Find the product card
    const productCard = target.closest('.product-card');
    if (!productCard) return;

    // Find the image inside this card
    const productImg = productCard.querySelector(
      '.product-image'
    ) as HTMLElement;

    if (productImg) {
      this.flyToCart(productImg);
    }
  }

}
