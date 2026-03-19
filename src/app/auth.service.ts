
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

setTokens(access: string, refresh: string) {
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
}

getAccessToken() {
  return localStorage.getItem('accessToken');
}

getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}
}