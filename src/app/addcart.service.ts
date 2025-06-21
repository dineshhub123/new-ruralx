import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { Product } from './product-zoom/product-zoom.component';
@Injectable({
  providedIn: 'root'
})
export class AddcartService {
  private addCartSubject = new BehaviorSubject<any>([]);
  addCartData = this.addCartSubject.asObservable();
  private cartSubject = new BehaviorSubject<any>([]);
  cart$ = this.cartSubject.asObservable();
  public addCartItem: Product[] = [];
  private cartKey = 'cart_items';
  constructor() {
    if (!localStorage.getItem(this.cartKey)) {
      localStorage.setItem(this.cartKey, JSON.stringify([]));
    }
  }
  // getAddCartData() {
  //   try {
  //     return this.addCartData
  //   } catch (error) {
  //   }
  // }
  // setAddCartData(data: any) {
  //   try {
  //     this.addCartSubject.next(data);
  //   } catch (error) {
  //   }
  // }

  getCart(): Product[] {
    return JSON.parse(localStorage.getItem(this.cartKey) || '[]');
  }
  addToCart(product: Product) {
    this.addCartItem = this.getCart();
    const exists = this.addCartItem.find(item => item.id === product.id);
    if (!exists) {
      this.addCartItem.push(product);
      this.saveCart(this.addCartItem);
      this.cartSubject.next([...this.addCartItem]); // notify subscribers

    }
  }
  saveCart(cart: Product[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  }
  getCartNext(): Product[] {
    return [...this.addCartItem]; // return a copy
  }
  clearCart(): void {
    this.saveCart([]);
  }
  removeCart(){
      this.addCartItem = this.getCart();
      this.cartSubject.next([...this.addCartItem]); // notify subscribers

  }
}
