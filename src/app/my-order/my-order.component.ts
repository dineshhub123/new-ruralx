import { Component } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css']
})
export class MyOrderComponent {
  public isLoading: boolean = false;
  public userOrder: any;
  public groupedOrders: any[] = [];
 public noDataFound:any
  imageBaseUrl = environment.imageBaseUrl;
  constructor(private apiService: ApiService,public router:Router) { }

  ngOnInit() {
    this.orderdList();
  }

  orderdList() {
    try {
      this.isLoading = true;
      let userAddress: any;
      userAddress = localStorage.getItem("login_user")
      let address = JSON.parse(userAddress)
      this.apiService.getOrderList().subscribe((res: any) => {
        this.noDataFound = res;
        this.isLoading = false;
        const userOrderList: any[] = [];
        res?.orders?.forEach((order: any) => {
          order?.items?.forEach((item: any) => {
            userOrderList.push({
              order_id: order.order_id,
              customer: order.delivery_address.name,
              mobile: order.delivery_address.mobile,
              address: order.delivery_address.address,
              product: item.product_name,
              price: item.price,
              quantity: item.quantity,
              total_item_price: item.price * item.quantity,
              total_amount: order.total_amount,
              status: order.status,
              order_date: order.created_at,
              userId: item.user_id,
              image: item.image,
              delivery_date: order.updated_at
            })
          })

          if (userOrderList) {
            const filterOrder = userOrderList.filter((item: any) => item?.userId === address.userId)
            this.isLoading = false;
            this.userOrder = filterOrder
            console.log(this.userOrder)
            this.groupOrdersById();
          }
        })
      
      })
    }
    catch (err) {
      console.log(err)
      this.isLoading = false;

    }
  }



groupOrdersById() {
  const map = new Map<string, any>();
  this.userOrder.forEach((item: any) => {
    const id = item.order_id;
    if (!map.has(id)) {
      map.set(id, {
        order_id: id,
        order_date: item.order_date,   // keep first date
        status: item.status,           // keep status (or latest)
        items: [],
        totalAmount: 0
      });
    }

    const group = map.get(id);
    group.items.push(item);
    group.totalAmount = item.total_amount;
  });

this.groupedOrders = Array.from(map.values());
this.groupedOrders = this.groupedOrders.sort((a: any, b: any) => {
  const aStatus = (a.status || '').toLowerCase();
  const bStatus = (b.status || '').toLowerCase();
  // delivered OR cancelled => should go bottom
  const aBottom = (aStatus === 'delivered' || aStatus === 'cancelled');
  const bBottom = (bStatus === 'delivered' || bStatus === 'cancelled');
  return Number(aBottom) - Number(bBottom);
});
console.log("groupedOrders",this.groupedOrders)
}
getOrderId(orderId:string){
  this.router.navigate(['/my-order/order-status', orderId]);
 }
}
