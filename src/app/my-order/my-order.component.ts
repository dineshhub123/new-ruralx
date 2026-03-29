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
  errMessage: boolean = false
  public groupedOrders: any[] = [];
  public noDataFound: any
  imageBaseUrl = environment.imageBaseUrl;
  constructor(private apiService: ApiService, public router: Router) { }

  ngOnInit() {
    this.orderdList();
  }

  getVariantLabel(item: any): string {
    if (!item) return 'Variant';
    const values = Array.isArray(item) ? item : [item];
    if (values.length === 0) return 'Variant';
    const first = String(values[0]).trim().toUpperCase();
    if (first.includes('GB') || first.includes('TB')) {
      return 'Storage';
    }
    if (/^\d+(C|Y)$/.test(first)) {
      return 'Size';
    }
    if (/^\d+$/.test(first)) {
      return 'Size';
    }
    const clothSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '3XL'];
    if (clothSizes.includes(first)) {
      return 'Size';
    }
    return 'Variant';
  }

orderdList() {
  this.isLoading = true;
  this.apiService.getOrderList().subscribe({
    next: (res: any) => {
      console.log("res",res)
      this.noDataFound = res;
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
            size: item.size,
            image: item.image,
            delivery_date: order.updated_at
          });
        });
      });
      this.userOrder = userOrderList;
      this.groupOrdersById();
      this.isLoading = false;
    },

    error: (err) => {
      console.log("API error:", err);
      if (err?.status === 401) {
        this.errMessage = true;
      }
      this.isLoading = false;
    }

  });
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
  getOrderId(orderId: string) {
    this.router.navigate(['/my-order/order-status', orderId]);
  }
    goToLogin() {
    this.router.navigate(['/login']);
  }

}
