import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AddressService } from '../address.service';

export interface User {
  userId: string;
  user_first_name: string;
  isGuest: boolean;
}
@Injectable({
  providedIn: 'root'
})

export class LoginService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();
  constructor(public addressService:AddressService) {
    const storedUser = localStorage.getItem('login_user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }else {
      // Create guest user on first visit
      const guestUser = {
        userId: 'guest_user',
        user_first_name: 'Guest',
        isGuest: true
      };
      this.setUser(guestUser);
    }
  }

  setUser(user: User) {
    localStorage.setItem('login_user', JSON.stringify(user));
    this.userSubject.next(user);
    this.addressService.setSelectedAddress(user);

  }

  logout() {  
    localStorage.removeItem('displaySearchData');
    localStorage.removeItem('selected-item');
    localStorage.removeItem('token');
    const guestUser: User = {
      userId: 'guest_user',
      user_first_name: 'Guest',
      isGuest: true
    };
    localStorage.setItem('login_user', JSON.stringify(guestUser));
    this.userSubject.next(guestUser);
    this.addressService.setSelectedAddress(null);
    localStorage.removeItem('selected_address'); // extra safe

  }
  getUser(): User | null {
    return this.userSubject.value;
  }

}
