import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  constructor() {
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
  }

  logout() {
    localStorage.clear();
    const guestUser: User = {
      userId: 'guest_user',
      user_first_name: 'Guest',
      isGuest: true
    };
    localStorage.setItem('login_user', JSON.stringify(guestUser));
    this.userSubject.next(guestUser);
  }
  getUser(): User | null {
    return this.userSubject.value;
  }

}
