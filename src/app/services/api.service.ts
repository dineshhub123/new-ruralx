import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map ,tap} from 'rxjs/operators';
import { environment } from '../../environments/environment';


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
  apiCategoryListURL:string = environment.getCategoryListApiUrl
  apiOnSelectCategoryListURL:string = environment.getMainCategoryApiUrl
  apiPlaceOrderUrl:string = environment.placeOrderApiUrl
  apiOrderListUrl:string = environment.getOrderListApiUrl;
  apiOrderByIdUrl:string = environment.getOrderByIdApiUrl;
  apiUpadateStatusUrl = environment.upadateStatusApiUrl;
  apiSubmitReviewUrl = environment.submitReviewApiUrl;
  apiGetReviewUrl = environment.getReviewApiUrl;
  apisubmitReviewHelpfulUrl = environment.submitReviewHelpfulApiUrl;
  apiGetReviewSummaryApiUrl = environment.getReviewSummaryApiUrl;
  apiInsertReturnOrderApiUrl = environment.getReturnOrderApiUrl;



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
  getUserDetailsData(object:any): Observable<any> {
    return this.http.post(this.getUserInfoURL,object).pipe(map((res: any) => res)); 
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
  getShippingAddressByUserId(userId:any):Observable<any> {
    return this.http.get(`${this.apiGetShippingAddressURL}?user_id=${userId}`).pipe(map((res:any)=>res))
  }
  updateShippingAddress(object:any): Observable<any> {
    return this.http.post(this.apiUpdateShippingAddressURL,object).pipe(map((res: any) => res));
  }
  deleteShippingAddress(object:any): Observable<any> {
    return this.http.post(this.apiDeleteShippingAddressURL,object).pipe(map((res: any) => res));
  }
  getCategoryList():Observable<any> {
    return this.http.get(this.apiCategoryListURL).pipe(map((res:any)=>res))
  }
  getOnSelctCategoryList(object:any):Observable<any> {
    return this.http.post(this.apiOnSelectCategoryListURL,object).pipe(map((res:any)=>res))
  }
  placeAnOrder(object:any):Observable<any> {
    return this.http.post(this.apiPlaceOrderUrl,object).pipe(map((res:any)=>res))
  }
  getOrderList():Observable<any>{
    return this.http.get(this.apiOrderListUrl).pipe(map((res:any)=>res))
  }
  getOrderByID(orderId:number):Observable<any>{
    return this.http.get(`${this.apiOrderByIdUrl}?order_id=${orderId}`).pipe(map((res:any)=>res))
  }
  updateOrderStatus(object:any): Observable<any> {
    return this.http.post(this.apiUpadateStatusUrl,object).pipe(map((res: any) => res));
  }
  submitReview(object:any): Observable<any> {
    return this.http.post(this.apiSubmitReviewUrl,object).pipe(map((res: any) => res));
  }
    submitReviewHelpful(object:any): Observable<any> {
    return this.http.post(this.apisubmitReviewHelpfulUrl,object).pipe(map((res: any) => res));
  }

    getProductReview(productId:number):Observable<any>{
    return this.http.get(`${this.apiGetReviewUrl}?product_id=${productId}`).pipe(map((res:any)=>res))
  }
    getReviewSummary(productId:number):Observable<any>{
    return this.http.get(`${this.apiGetReviewSummaryApiUrl}?product_id=${productId}`).pipe(map((res:any)=>res))
  }

  returnOrder(object:any): Observable<any> {
    return this.http.post(this.apiInsertReturnOrderApiUrl,object).pipe(map((res: any) => res));
  }

}
