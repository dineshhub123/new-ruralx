import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddcartService } from '../services/addcart.service';

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
    addItam.image_url = addItam?.variants[0].images;
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
    let addItem: any = {};
    addItem = localStorage.getItem('cart_items')
    let incItem = JSON.parse(addItem)
    let findObj = incItem.find((x: any) => x?.id === incrItem?.id && x?.userId === incrItem?.userId)
    if (findObj) {
      findObj.quantity = incrItem.quantity;
    } else {
      incItem.push({
        ...incrItem,
        quantity: incrItem.quantity
      });
    }
    localStorage.setItem('cart_items', JSON.stringify(incItem))
    this.addCartService.removeCart();
    this.searchItem = JSON.parse(incItem)

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

