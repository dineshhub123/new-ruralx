import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentApiService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createOrder(amount: number) {
    return this.http.post<any>(
      `${this.baseUrl}/create-order.php`,
      { amount }
    );
  }

  verifyPayment(data: any) {
    return this.http.post<any>(
      `${this.baseUrl}/verify-payment.php`,
      data
    );
  }
}
