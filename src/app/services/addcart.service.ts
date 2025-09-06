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
  constructor() {
    this.loadCart();
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
  addToCart(product: any): void {
    const cart = this.getCart();
    const exists = cart.find(item => item.id === product.id && item.userId === product.userId);
    if (!exists) {
      cart.push(product);
      this.saveCart(cart);
      this.cartSubject.next([...cart]);
    }
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
}
