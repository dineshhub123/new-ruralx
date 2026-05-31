import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ReturnDailogComponent } from '../return-dailog/return-dailog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-my-order-status',
  templateUrl: './my-order-status.component.html',
  styleUrls: ['./my-order-status.component.css']
})
export class MyOrderStatusComponent {

  public orderId: any;
  isMobile: boolean = false;
  selectedItems: any[] = [];

  // ✅ API response is object (not array)
  public orderStatusData: any = null;

  // ✅ stepper steps
  steps = [
    { key: 'pending', label: 'Pending', icon: 'shopping_cart', description: 'Your order has been received' },
    { key: 'confirmed', label: 'Confirmed', icon: 'check_circle', description: 'Order has been confirmed' },
    { key: 'processing', label: 'Processing', icon: 'build', description: 'Preparing your order' },
    { key: 'shipped', label: 'Shipped', icon: 'local_shipping', description: 'Order has been shipped' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: 'delivery_dining', description: 'Order is out for delivery' },
    { key: 'delivered', label: 'Delivered', icon: 'assignment_turned_in', description: 'Order has been delivered' },
    
  ];

prepareSteps() {
  this.steps = [...this.steps];
  if(this.orderStatusData?.status === 'Partially_Returned'){
      this.steps.push({
          key:'Partially_Returned',
          label:'Partially Returned',
          description:'Some items refunded successfully',
          icon:'assignment_return'
      });
  }
  if(this.orderStatusData?.status === 'Fully_Returned'){
      this.steps.push({
          key:'Fully_Returned',
          label:'Fully Returned',
          description:'Refund completed successfully',
          icon:'assignment_return'
      });
  }
  if(this.orderStatusData?.status === 'Partially_Replaced'){
      this.steps.push({
          key:'Partially_Replaced',
          label:'Partially Replaced',
          description:'Some replacement items delivered',
          icon:'swap_horiz'
      });
  }
  if(this.orderStatusData?.status === 'Fully_Replaced'){
      this.steps.push({
          key:'Fully_Replaced',
          label:'Fully Replaced',
          description:'Replacement completed successfully',
          icon:'swap_horiz'
      });
  }
}


  // ✅ current step index
  currentIndex: number = 0;

  // optional
  isLoading: boolean = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public apiService: ApiService,
    public dialog: MatDialog
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
          this.prepareSteps();
          this.setStepperStatus(res?.data?.status);
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
    if (status === 'cancelled'
    ) {
      this.currentIndex = -1;
      return;
    }
    const idx = this.steps.findIndex(s => s.key === status);
    this.currentIndex = idx === -1 ? 0 : idx;
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
      'badge-return': status === 'Return_Requested',
      'badge-replace': status === 'Replace_Requested',
      'badge-partial': status === 'Partially_Returned',
      'badge-fully': status === 'Fully_Returned',
      'badge-partial-replace': status === 'Partially_Replaced',
      'badge-fully-replace': status === 'Fully_Replaced',
      'badge-replace-ship': status === 'Replacement_Shipped',
      'badge-return-approve': status === 'Return_Approved',
      'badge-replace-approve': status === 'Replace_Approved',
      'badge-refund-processing': status === 'Refund_Processing',
      'badge-replace-picked': status === 'Picked_Up',




    };
  }

  // ✅ helper for image (first image)
  getProductImage(item: any): string {
    if (item?.image && item.image.length > 0) {
      return `https://ruralx.in/api/${item.image}`; // change base url if needed
    }
    return 'assets/no-image.png';
  }
  reOrder() {

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

  canReturn(): boolean {
    const order = this.orderStatusData;
    if (!order) return false;
    if (order.status !== 'delivered') return false;
    const deliveryDate = new Date(order.updated_at);
    const now = new Date();
    const diffTime = now.getTime() - deliveryDate.getTime();
    const hoursPassed = diffTime / (1000 * 60 * 60);
    return diffTime <= (24 * 60 * 60 * 1000); // 24 hours
  }

  toggleItem(item: any) {
    const index = this.selectedItems.findIndex(i => i.product_id === item.product_id);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item);
    }
  }
  isSelected(item: any) {
    return this.selectedItems.some(i => i.product_id === item.product_id);
  }

  openReturnDialog() {
    const dialogRef = this.dialog.open(ReturnDailogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: {
        item: this.selectedItems,
        orderId: this.orderStatusData
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.checkOrderStatus(result.data.order_id)
      }
    });
  }
getStatusMessage(status: string): string {
  switch ((status || '').toLowerCase()) {

    case 'return_requested':
      return 'Your return request has been submitted successfully. Waiting for admin approval.';

    case 'return_approved':
      return 'Your return request has been approved successfully. Our team will process it shortly.';

    case 'refund_processing':
      return 'Your refund is currently being processed. Please wait while we complete the transaction.';

    case 'partially_returned':
      return 'Some items from your order have been returned and refunded successfully.';

    case 'fully_returned':
      return 'Your return and refund process has been completed successfully.';

    case 'replace_requested':
      return 'Replacement request submitted successfully. Waiting for admin approval.';

    case 'replace_approved':
      return 'Your replacement request has been approved successfully. We will ship your replacement item soon.';

    case 'replacement_shipped':
      return 'Your replacement item has been shipped successfully and is on the way.';

    case 'partially_replaced':
      return 'Some replacement items have been delivered successfully.';

    case 'fully_replaced':
      return 'Replacement items delivered successfully.';

    case 'picked_up':
      return 'Your item has been picked up successfully. Our team will process it shortly.';

    default:
      return '';
  }
}


getOrderStatusText(orderStatusData: any): string {

  // Cancelled Orders
  if (orderStatusData?.status === 'cancelled') {

    if (orderStatusData?.payment_method === 'ONLINE') {

      switch (orderStatusData?.refund_status) {

        case 'pending':
          return 'Refund Pending';

        case 'processing':
          return 'Refund In Progress';

        case 'completed':
          return 'Refund Completed';

        default:
          return 'Cancelled';
      }
    }

    return 'Cancelled';
  }

  // Other Statuses
  switch (orderStatusData?.status) {

    case 'out_for_delivery':
      return 'Out for Delivery';

    case 'Return_Requested':
      return 'Return Requested';

    case 'Replace_Requested':
      return 'Replace Requested';

    case 'Partially_Returned':
      return 'Partially Returned';

    case 'Fully_Returned':
      return 'Fully Returned';

    case 'Partially_Replaced':
      return 'Partially Replaced';

    case 'Fully_Replaced':
      return 'Fully Replaced';

    case 'Replacement_Shipped':
      return 'Replacement Shipped';

    case 'Return_Approved':
      return 'Return Approved';

    case 'Replace_Approved':
      return 'Replace Approved';

    case 'Refund_Processing':
      return 'Refund Processing';

    case 'Picked_Up':
      return 'Picked Up';

    default:
      return orderStatusData?.status
        ?.replace(/_/g, ' ')
        ?.replace(/\b\w/g, (c: string) => c.toUpperCase()) || '';
  }
}
  getStatusClass(status: string): string {
    switch ((status || '').toLowerCase()) {
      case 'return_requested':
      case 'partially_returned':
      case 'fully_returned':
      case 'refund_processing':
      case 'return_approved':
        return 'return-msg';
      case 'replace_requested':
      case 'partially_replaced':
      case 'fully_replaced':
      case 'replacement_shipped':
      case 'replace_approved':
      case 'picked_up':
        return 'replace-msg';
      default:
        return '';
    }
  }
}
