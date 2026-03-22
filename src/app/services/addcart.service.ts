import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
@Injectable({
  providedIn: 'root'
})
export class AddcartService {

  /* =========================
     CART STATE
  ========================= */
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();

  /* =========================
     BUY NOW STATE (LOCAL)
  ========================= */
  private buyItemsSource = new BehaviorSubject<any[]>([]);
  buyItems$ = this.buyItemsSource.asObservable();

  constructor(private apiService: ApiService) {
    this.loadCartFromAPI(); // ✅ load cart on app start
    this.loadBuyDataFromStorage();
  }

  /* =========================
     CART METHODS (API BASED)
  ========================= */

  /* LOAD CART FROM BACKEND */
  loadCartFromAPI() {
    this.apiService.getCartData().subscribe({
      next: (res: any) => {
        this.cartSubject.next(res || []);
      },
      error: (err) => {
        console.error('Cart load error:', err);
        this.cartSubject.next([]);
      }
    });
  }

  /* GET CURRENT CART (SYNC) */
  getCart(): any[] {
    return this.cartSubject.value;
  }

  /* ADD TO CART (RETURN OBSERVABLE) */
  addToCart(product: any) {
    return this.apiService.addToCartData(product);
  }

  /* REMOVE ITEM */
  removeItem(cartId: number) {
   // return this.apiService.removeCartItem(cartId);
  }

  /* OPTIONAL: CLEAR LOCAL STATE */
  clearCart() {
    this.cartSubject.next([]);
  }
updateQuantity(item: any, quantity: number) {
  return this.apiService.updateCartQuantity({
    id: item.id,
    quantity: quantity
  });
}
  /* =========================
     BUY NOW (LOCAL STORAGE)
  ========================= */

  setBuyNowItem(data: any | any[]) {
    const finalData = Array.isArray(data) ? data : [data];
    localStorage.setItem('checkout_data', JSON.stringify(finalData));
    this.buyItemsSource.next(finalData);
  }

  clearBuyNowItem() {
    localStorage.removeItem('checkout_data');
    this.buyItemsSource.next([]);
  }

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