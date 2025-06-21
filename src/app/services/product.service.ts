import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

 private apiUrl = 'http://localhost/admin/backend/getProductDetails.php';

  constructor(private http: HttpClient) { }

  // Get all products
  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
