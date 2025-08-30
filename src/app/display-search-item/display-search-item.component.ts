import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddcartService } from '../addcart.service';

@Component({
  selector: 'app-display-search-item',
  templateUrl: './display-search-item.component.html',
  styleUrls: ['./display-search-item.component.css']
})
export class DisplaySearchItemComponent implements OnInit {
  public searchItem: any;
  public items: any;
  public addCartData: any;
  constructor(public router: Router, public addCartService: AddcartService) {

  }
  ngOnInit() {
    this.itemInitilize();
  }
  itemInitilize() {
    let data: any;
    data = localStorage.getItem('displaySearchData')
    this.searchItem = JSON.parse(data);
    console.log("searchItem",this.searchItem)
  }
  ngAfterViewInit() {

  }
  imgClick(item: any) {
    localStorage.setItem('selected-item', JSON.stringify(item))
    this.router.navigate(['pzoom'])
  }
  addCartQuntity(addItam: any) {
    let user:any;
    user = localStorage.getItem("login_user");
    let findUser = JSON.parse(user)
    addItam.quantity = 1;
    addItam.userId = findUser?.userId;
    addItam.isGuest = findUser?.isGuest;
    this.addCartService.addToCart(addItam)
  }


  decrement(decItem: any) {
    if (decItem.quantity > 0) {
      decItem.quantity--;
    }
    let deleteItem: any = {};
    deleteItem = localStorage.getItem('cart_items')
    let diTtem = JSON.parse(deleteItem)
    let index = diTtem.findIndex((x: any) => x?.id === decItem?.id && x?.userId === decItem?.userId)
    if (index !== -1) {
      if (decItem.quantity === 0) {
        diTtem.splice(index, 1);
      } else {
        diTtem[index].quantity = decItem.quantity;
      }
    }
    localStorage.setItem('cart_items', JSON.stringify(diTtem))
    this.addCartService.removeCart();
    this.searchItem = JSON.parse(diTtem)

    setTimeout(() => {
      this.reloadCurrentRoute();
    }, 5)

  }
  increment(incrItem: any) {
    incrItem.quantity++;
    let deleteItem: any = {};
    deleteItem = localStorage.getItem('cart_items')
    let diTtem = JSON.parse(deleteItem)
    let findObj = diTtem.find((x: any) => x?.id === incrItem?.id && x?.userId === incrItem?.userId)
    if (findObj) {
      findObj.quantity = incrItem.quantity;
    } else {
      diTtem.push({
        ...incrItem,
        quantity: incrItem.quantity
      });
    }
    localStorage.setItem('cart_items', JSON.stringify(diTtem))
    this.addCartService.removeCart();
    this.searchItem = JSON.parse(diTtem)

    setTimeout(() => {
      this.reloadCurrentRoute();
    }, 5)

  }
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

}

