import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AddressService {

  private selectedAddressSubject = new BehaviorSubject<any>(this.getSelectedAddress());
  selectedAddress$ = this.selectedAddressSubject.asObservable();

setSelectedAddress(addr: any) {
  this.selectedAddressSubject.next(addr);
  if (!addr?.isGuest) {
    localStorage.setItem('selected_address', JSON.stringify(addr));
  } else {
    localStorage.removeItem('selected_address'); // ✅ clear properly
  }
}
  getSelectedAddress() {
    const saved = localStorage.getItem('selected_address');
    return saved ? JSON.parse(saved) : null;
  }
}
