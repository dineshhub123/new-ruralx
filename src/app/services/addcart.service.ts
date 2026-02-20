import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { Product } from '../product-zoom/product-zoom.component';
@Injectable({
  providedIn: 'root'
})
export class AddcartService {
  private cartKey = 'cart_items';
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();
  private buyItemsSource = new BehaviorSubject<any[]>([]);
  buyItems$ = this.buyItemsSource.asObservable();
  constructor() {
    this.loadCart();
    this.loadBuyDataFromStorage();
  }
  private loadCart(): void {
    const saved = localStorage.getItem(this.cartKey);
    const cart = saved ? JSON.parse(saved) : [];
    this.cartSubject.next(cart);
  }
  getCart(): any[] {
    return JSON.parse(localStorage.getItem(this.cartKey) || '[]');
  }
  saveCart(cart: any[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  }
  addToCart(product: any): boolean {
  const MAX_QTY = 4;
  const cart = this.getCart();

  const exists = cart.find(
    item =>
      item.id === product.id &&
      item.userId === product.userId &&
      item.color === product.color
  );

  if (exists) {
    const currentQty = exists.quantity || 1;
    const addQty = product.quantity || 1;
    const newQty = currentQty + addQty;
    exists.quantity = newQty > MAX_QTY ? MAX_QTY : newQty;
    if (currentQty >= MAX_QTY) {
      return false; // max reached
    }

  } else {
    // New product → but still cap
    product.quantity = Math.min(product.quantity || 1, MAX_QTY);
    cart.push(product);
  }

  this.saveCart(cart);
  this.cartSubject.next([...cart]);
  return true;
}

  setCart(items: any[]): void {
    this.saveCart(items);
    this.cartSubject.next(items);
  }
  removeCart(): void {
    let removeItem = this.getCart();
    //this.saveCart([]);
    this.cartSubject.next([...removeItem]);
  }
  // addcart.service.ts
  transferCart(fromId: string, toId: string): void {
    const all = this.getCart();
    // items that belonged to the guest
    const moved = all
      .filter(i => i.userId === fromId).map(i => ({ ...i, userId: toId }));
    // keep everything else
    const others = all.filter(i => i.userId !== fromId);
    const merged = [...others, ...moved];
    this.setCart(merged);        // saves + broadcasts
  }

// Set Buy Now Items
  setBuyNowItem(data: any | any[]) {
  const finalData = Array.isArray(data) ? data : [data];
  localStorage.setItem('checkout_data', JSON.stringify(finalData));
  this.buyItemsSource.next(finalData);
}

 //  Clear buy now data
  clearBuyNowItem() {
    localStorage.removeItem('checkout_data');
    this.buyItemsSource.next([]);
  }
  // Get Current buy Value (optional)
  getCurrentBuyItems() {
    return this.buyItemsSource.value;
  }
  loadBuyDataFromStorage() {
    const stored = localStorage.getItem('checkout_data');
    if (stored) {
      this.buyItemsSource.next(JSON.parse(stored));
    }
  }
}
