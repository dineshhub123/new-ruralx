import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-my-order-status',
  templateUrl: './my-order-status.component.html',
  styleUrls: ['./my-order-status.component.css']
})
export class MyOrderStatusComponent {

  public orderId: any;
  isMobile: boolean = false;

  // ✅ API response is object (not array)
  public orderStatusData: any = null;

  // ✅ stepper steps
  steps = [
    { key: 'pending', label: 'Pending', icon: 'shopping_cart', description: 'Your order has been received' },
    { key: 'confirmed', label: 'Confirmed', icon: 'check_circle', description: 'Order has been confirmed'},
    { key: 'processing', label: 'Processing', icon: 'build',description: 'Preparing your order' },
    { key: 'shipped', label: 'Shipped', icon: 'local_shipping',description: 'Order has been shipped'},
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: 'delivery_dining',description: 'Order is out for delivery' },
    { key: 'delivered', label: 'Delivered', icon: 'assignment_turned_in',description: 'Order has been delivered' },

  ];

  // ✅ current step index
  currentIndex: number = 0;

  // optional
  isLoading: boolean = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public apiService: ApiService
  ) { }

  ngOnInit() {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());

    this.activatedRoute.params.subscribe(params => {
      const order_id = params['order_id'];
      this.orderId = order_id;

      if (order_id) {
        this.checkOrderStatus(order_id);
      }
    });
  }
getExpectedDeliveryMessage(createdAt: string): string {
  if (!createdAt) return '';
  // Convert "2026-01-16 19:52:58" => "2026-01-16T19:52:58"
  const orderDate = new Date(createdAt.replace(' ', 'T'));
  const orderHour = orderDate.getHours();
  // cutoff = 6 PM (18:00)
  const isNextDayMorning = orderHour >= 18;
  if (isNextDayMorning) {
    return 'Expected Delivery Tomorrow by 2:00 PM';
  } else {
    return 'Expected Delivery Today by 9:00 PM';
  }
}



checkMobile() {
  this.isMobile = window.innerWidth <= 768; // mobile breakpoint
}
  checkOrderStatus(orderId: any) {
    this.isLoading = true;

    this.apiService.getOrderByID(orderId).subscribe({
      next: (res: any) => {
        if (res) {
          this.orderStatusData = res?.data;

          // ✅ update stepper
          this.setStepperStatus(res?.data?.status);

          console.log("Order Data:", this.orderStatusData);
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.log("API Error:", err);
        this.isLoading = false;
      }
    });
  }

  // ✅ stepper status set
  setStepperStatus(status: string) {
     // ✅ if cancelled -> disable all steps
  if (status === 'cancelled') {
    this.currentIndex = -1;
    return;
  }
    const idx = this.steps.findIndex(s => s.key === status);
    this.currentIndex = idx === -1 ? 0 : idx;
    console.log("currentIndex",this.currentIndex)
  }
statusClass(status: string) {
  return {
    'badge-pending': status === 'pending',
    'badge-confirmed': status === 'confirmed',
    'badge-processing': status === 'processing',
    'badge-shipped': status === 'shipped',
    'badge-out_for_delivery': status === 'out_for_delivery',
    'badge-delivered': status === 'delivered',
    'badge-cancelled': status === 'cancelled',

  };
}

  // ✅ helper for image (first image)
  getProductImage(item: any): string {
    if (item?.image && item.image.length > 0) {
      return `https://ruralx.in/api/${item.image[0]}`; // change base url if needed
    }
    return 'assets/no-image.png';
  }
reOrder(){

}

cancelOrder(): void {
  if (!this.orderStatusData?.order_id) return;
  const ok = confirm(`Are you sure you want to cancel order ${this.orderStatusData?.order_id}?`);
  // ✅ If user pressed NO, stop here
  if (!ok) return;
  this.isLoading = true;
  const statusPayload = {
    order_id: this.orderStatusData?.order_id,
    status: 'cancelled'
  };
  this.apiService.updateOrderStatus(statusPayload).subscribe({
    next: (res: any) => {
      alert(`Order ${this.orderStatusData?.order_id} has been cancelled successfully!`);
      // ✅ update UI status also
      this.orderStatusData.status = 'cancelled';
      this.setStepperStatus('cancelled'); // if you handle cancelled step (optional)
      this.isLoading = false;
    },
    error: (err: any) => {
      console.log(err);
      alert('Failed to cancel order. Please try again.');
      this.isLoading = false;
    }
  });

}


}
