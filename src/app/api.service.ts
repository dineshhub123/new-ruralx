import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map ,tap} from 'rxjs/operators';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  headers:any;
  auth:any;
  apiProductListURL:string = environment.getProductListDetailsApiUrl;
  getUserInfoURL:string = environment.getUserDetailsApiURL;
  apiSearchURL:string = environment.searchApiUrl;
  apiUploadDataURL:string = environment.uploadDataApiUrl;
  apiInsertUserInfoURL:string = environment.insertUserDetailsApiUrl;
  apiProductNotifyURL:string = environment.getProductNotifyApiUrl;
  apiProductbuyerURL:string = environment.productBuyerApiUrl;
  apiBuyerDataURL:string = environment.getBuyerDataApiUrl;
  apiShippingAddressURL:string = environment.insertshippingAddressApiUrl;
  apiGetShippingAddressURL:string = environment.getShippingAddressApiUrl;
  apiUpdateShippingAddressURL:string = environment.updateShippingAddressApiUrl
  apiDeleteShippingAddressURL:string = environment.deleteShippingAddressApiUrl

  constructor(private http: HttpClient,private router:Router) { }
  
  commonHeaderFunction(){
    this.auth = '';
    if (localStorage.getItem("jwt_token") !== null) {
     this.auth = 'Bearer ' + localStorage.getItem("jwt_token");
      this.headers = {
       headers: new HttpHeaders({
         'Content-Type': 'application/json',
         'Authorization': this.auth,
       })
     };
    }
  }


  
  // employeeData(object): Observable<any> {
  //   //this.commonHeaderFunction(); 
  //   return this.http.post(this.apiURL + "user-info", object).pipe(map((res: any) => res));
  // }
  getProductListDetailsData(): Observable<any> {
    return this.http.get(this.apiProductListURL).pipe(map((res: any) => res)); 
  }
  getUserDetailsData(): Observable<any> {
    return this.http.get(this.getUserInfoURL).pipe(map((res: any) => res)); 
  }
  searchData(object:any): Observable<any> {
    return this.http.post(this.apiSearchURL,object).pipe(map((res: any) => res));
  }
  uploadData(object:any): Observable<any> {
    return this.http.post(this.apiUploadDataURL,object).pipe(map((res: any) => res));
  }
  insertUserDetails(object:any): Observable<any> {
    return this.http.post(this.apiInsertUserInfoURL,object).pipe(map((res: any) => res));
  }
  ProductNotificationDetails(object:any): Observable<any> {
    return this.http.post(this.apiProductNotifyURL,object).pipe(map((res: any) => res));
  }
  ProductBuyerDetails(object:any): Observable<any> {
    return this.http.post(this.apiProductbuyerURL,object).pipe(map((res: any) => res));
  }
  getUserBuyerDetails():Observable<any> {
    return this.http.get(this.apiBuyerDataURL).pipe(map((res:any)=>res))
  }
  
  insertShippingAddress(object:any): Observable<any> {
    return this.http.post(this.apiShippingAddressURL,object).pipe(map((res: any) => res));
  }
  getShippingAddress():Observable<any> {
    return this.http.get(this.apiGetShippingAddressURL).pipe(map((res:any)=>res))
  }
  updateShippingAddress(object:any): Observable<any> {
    return this.http.post(this.apiUpdateShippingAddressURL,object).pipe(map((res: any) => res));
  }
  deleteShippingAddress(object:any): Observable<any> {
    return this.http.post(this.apiDeleteShippingAddressURL,object).pipe(map((res: any) => res));
  }
}
