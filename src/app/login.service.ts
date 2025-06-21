import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private usernameSubject = new BehaviorSubject<string  | null>(null);
  username$ = this.usernameSubject.asObservable();
  constructor() {
    this.loadUsername();
  }


  setUsername(username: string) {
    console.log(username, 'uname');
    this.usernameSubject.next(username);
    localStorage.setItem('username', username);

  }
  private getStorageUsername(): string | null {
    return localStorage.getItem("username");
  }
   loadUsername(): void {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.usernameSubject.next(storedUsername);
    }
  }
  clearUsername() {
    localStorage.removeItem('username');
    this.usernameSubject.next(null)
  }

  getUsername() {
      return this.username$
  }
  

}
