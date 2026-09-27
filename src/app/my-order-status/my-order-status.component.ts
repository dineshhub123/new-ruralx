import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ReturnDailogComponent } from '../return-dailog/return-dailog.component';
import { MatDialog } from '@angular/material/dialog';
import { jsPDF } from 'jspdf';

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
// ==========================================
// RURALX INVOICE - COMPLETE ANGULAR CODE
// ==========================================

// ------------------------------------------
// ------------------------------------------
// SHOW INVOICE
// ------------------------------------------

showInvoice(): void {

  if (!this.orderStatusData) {
    return;
  }

  const pdf = this.generateInvoicePdf();

  const fileName =
    `taxable-bill-${this.orderStatusData?.order_id || 'invoice'}.pdf`;

  // Generate PDF as Base64 data URI
  const dataUri = pdf.output('datauristring');

  const android = (window as any).Android;

  if (android) {

    // Prefer Base64/data URI bridge over blob URL
    if (typeof android.showInvoice === 'function') {

      android.showInvoice(dataUri);

      return;
    }

    if (typeof android.openPdf === 'function') {

      // Pass data URI instead of blob URL
      android.openPdf(dataUri, fileName);

      return;
    }
  }

  // Browser fallback
  const blob = pdf.output('blob');
  const url = URL.createObjectURL(blob);

  const opened = window.open(url, '_blank');

  if (!opened) {

    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 60000);
}


// ------------------------------------------
// DOWNLOAD INVOICE
// ------------------------------------------

downloadInvoice(): void {

  if (!this.orderStatusData) {
    return;
  }

  const pdf = this.generateInvoicePdf();

  const fileName =
    `taxable-bill-${this.orderStatusData?.order_id || 'invoice'}.pdf`;

  // Generate PDF as Base64 data URI
  const dataUri = pdf.output('datauristring');

  const android = (window as any).Android;

  if (android) {

    // Prefer Base64/data URI bridge
    if (typeof android.saveInvoice === 'function') {

      android.saveInvoice(dataUri, fileName);

      return;
    }

    if (typeof android.downloadPdf === 'function') {

      // Pass data URI instead of blob URL
      android.downloadPdf(dataUri, fileName);

      return;
    }
  }

  // Browser fallback
  pdf.save(fileName);
}

// ------------------------------------------
// INVOICE ITEMS
// ------------------------------------------

getInvoiceRows(): any[] {

  const items = this.orderStatusData?.items || [];

  return items.map((item: any) => {

    const qty = Number(item.quantity || 1);

    const price = Number(
      item.price ?? item.product_price ?? 0
    );

    const gstRate = Number(
      item.gst_rate ?? item.gst ?? 0
    );

    // Taxable value before GST
    const taxableValue = price * qty;

    // GST amount
    const gstValue =
      taxableValue * (gstRate / 100);

    // Final product value including GST
    const total = taxableValue + gstValue;

    return {
  name: this.toTitleCase(
    item.product_name ||
    item.name ||
    'Product'
  ),

  qty,
  price,
  gstRate,
  taxableValue,
  gstValue,
  total
};
  });
}


// ------------------------------------------
// NUMBER TO WORDS - INDIAN SYSTEM
// ------------------------------------------

convertNumberToWordsIndian(amount: number): string {

  // Round to the nearest paise first
  const totalPaise = Math.round(
    Math.max(0, Number(amount) || 0) * 100
  );

  const rupees = Math.floor(
    totalPaise / 100
  );

  const paise = totalPaise % 100;

  const ones = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine'
  ];

  const teens = [
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen'
  ];

  const tens = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety'
  ];

  // Convert 1 to 99
  const twoDigitWords = (num: number): string => {

    if (num < 10) {
      return ones[num];
    }

    if (num < 20) {
      return teens[num - 10];
    }

    const ten = Math.floor(num / 10);
    const unit = num % 10;

    return unit > 0
      ? `${tens[ten]} ${ones[unit]}`
      : tens[ten];
  };

  // Convert 1 to 999
  const threeDigitWords = (num: number): string => {

    const hundred = Math.floor(num / 100);
    const remainder = num % 100;

    let result = '';

    if (hundred > 0) {

      result =
        `${ones[hundred]} hundred`;
    }

    if (remainder > 0) {

      result += result ? ' ' : '';

      result += twoDigitWords(remainder);
    }

    return result;
  };

  // Indian numbering: Crore, Lakh, Thousand, Hundred
  const toIndianWords = (num: number): string => {

    if (num === 0) {
      return 'zero';
    }

    const parts: string[] = [];

    const crore = Math.floor(
      num / 10000000
    );

    num %= 10000000;

    const lakh = Math.floor(
      num / 100000
    );

    num %= 100000;

    const thousand = Math.floor(
      num / 1000
    );

    num %= 1000;

    if (crore > 0) {

      parts.push(
        `${threeDigitWords(crore)} crore`
      );
    }

    if (lakh > 0) {

      parts.push(
        `${threeDigitWords(lakh)} lakh`
      );
    }

    if (thousand > 0) {

      parts.push(
        `${threeDigitWords(thousand)} thousand`
      );
    }

    if (num > 0) {

      parts.push(
        threeDigitWords(num)
      );
    }

    return parts.join(' ');
  };

  // Rupees in words
  const rupeeWords = toIndianWords(rupees);

  const capitalizedRupees =
    rupeeWords.charAt(0).toUpperCase() +
    rupeeWords.slice(1);

  // Paise in words
  let paiseText = '';

  if (paise > 0) {

    const paiseWords =
      twoDigitWords(paise);

    const paiseLabel =
      paise === 1 ? 'paisa' : 'paise';

    paiseText =
      ` and ${paiseWords} ${paiseLabel}`;
  }

  return `${capitalizedRupees} rupees${paiseText} only`;
}


// ------------------------------------------
// INVOICE SUMMARY
// ------------------------------------------

getInvoiceSummary() {

  const rows = this.getInvoiceRows();

  const subtotal = rows.reduce(
    (sum, row) => sum + row.taxableValue,
    0
  );

  const gstTotal = rows.reduce(
    (sum, row) => sum + row.gstValue,
    0
  );

  const calculatedTotal = rows.reduce(
    (sum, row) => sum + row.total,
    0
  );

  const total =
    calculatedTotal ||
    Number(this.orderStatusData?.total_amount || 0);

  return {

    subtotal,

    gstTotal,

    total,

    totalInWords:
      this.convertNumberToWordsIndian(total),

    // Replace with RuralX's actual GSTIN
    gstin: '23AAPCR4320N1Z4',

    invoiceNumber:
      this.orderStatusData?.order_id ||
      'INV-0001',

    date: this.orderStatusData?.created_at
      ? new Date(
          this.orderStatusData.created_at
        ).toLocaleDateString('en-IN')
      : new Date().toLocaleDateString('en-IN'),

    customerName:
      this.orderStatusData?.delivery_address?.name ||
      'Customer',

    address:
      this.orderStatusData?.delivery_address?.address ||
      'N/A',

    mobile:
      this.orderStatusData?.delivery_address?.mobile ||
      'N/A'
  };
}


// ------------------------------------------
// GENERATE INVOICE PDF
// ------------------------------------------

generateInvoicePdf(): jsPDF {

  const summary = this.getInvoiceSummary();

  const rows = this.getInvoiceRows();

  const pdf = new jsPDF({
    unit: 'pt',
    format: 'a4',
    orientation: 'portrait'
  });

  const pageWidth =
    pdf.internal.pageSize.getWidth();

  const pageHeight =
    pdf.internal.pageSize.getHeight();

  const margin = 40;

  const tableWidth =
    pageWidth - margin * 2;

  const teal = [15, 118, 110];

  const white = [255, 255, 255];

  const black = [0, 0, 0];

  const borderColor = [200, 200, 200];

  const lightGray = [235, 235, 235];

  const footerY = pageHeight - 35;

  const headerHeight = 26;

  const bottomLimit = pageHeight - 90;

  // ----------------------------------------
  // TABLE COLUMN CONFIGURATION
  // ----------------------------------------

  // Total width = 515 points on A4 portrait

  const colWidths = [
    120,  // Product
    35,   // Qty
    65,   // Price
    80,   // Taxable Value
    45,   // GST %
    80,   // GST Amount
    90    // Total
  ];

  const headers = [
    'Product',
    'Qty',
    'Price',
    'Taxable Value',
    'GST %',
    'GST Amount',
    'Total'
  ];

  const colX: number[] = [margin];

  for (let i = 0; i < colWidths.length; i++) {

    colX.push(
      colX[i] + colWidths[i]
    );
  }

  const tableRight =
    margin + tableWidth;

  const rowPadding = 6;

  // ----------------------------------------
  // HEADER
  // ----------------------------------------

  const drawInvoiceHeader = () => {

    const headerTop = 40;

    // Title
    pdf.setTextColor(
      teal[0],
      teal[1],
      teal[2]
    );

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(26);

    pdf.text(
      'Taxable Bill',
      margin,
      headerTop
    );

    // Company name
    pdf.setTextColor(
      black[0],
      black[1],
      black[2]
    );

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);

    pdf.text(
      'RuralX',
      margin,
      headerTop + 32
    );

    // GSTIN directly under company name
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);

    pdf.text(
      `GSTIN: ${summary.gstin}`,
      margin,
      headerTop + 49
    );

    // Invoice details
    const invoiceMetaX =
      pageWidth - margin;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);

    pdf.text(
      `Invoice No: ${summary.invoiceNumber}`,
      invoiceMetaX,
      headerTop + 10,
      { align: 'right' }
    );

    pdf.text(
      `Date: ${summary.date}`,
      invoiceMetaX,
      headerTop + 25,
      { align: 'right' }
    );

    // Divider below GSTIN
    pdf.setDrawColor(
      borderColor[0],
      borderColor[1],
      borderColor[2]
    );

    pdf.setLineWidth(0.5);

    pdf.line(
      margin,
      headerTop + 62,
      pageWidth - margin,
      headerTop + 62
    );
  };

  drawInvoiceHeader();

  // ----------------------------------------
  // CUSTOMER DETAILS
  // ----------------------------------------

  let customerY = 125;

  pdf.setTextColor(
    black[0],
    black[1],
    black[2]
  );

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);

  pdf.text(
    'Bill To:',
    margin,
    customerY
  );

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);

  pdf.text(
    summary.customerName,
    margin,
    customerY + 18
  );

  // Wrap customer address
  const compactAddress =
    String(summary.address || 'N/A')
      .replace(/\s+/g, ' ')
      .trim();

  const addressLines =
    pdf.splitTextToSize(
      compactAddress,
      tableWidth
    );

  const addressY = customerY + 35;

  pdf.text(
    addressLines,
    margin,
    addressY
  );

  const addressHeight =
    addressLines.length * 13;

  const mobileY =
    addressY + addressHeight + 4;

  pdf.text(
    `Mobile: ${summary.mobile}`,
    margin,
    mobileY
  );

  // GSTIN is intentionally NOT repeated here.

  // ----------------------------------------
  // TABLE HEADER
  // ----------------------------------------

  const tableStartY =
    mobileY + 22;

  let rowY = tableStartY;

  const drawTableHeader = (startY: number) => {

    // Full-width background includes Total column
    pdf.setFillColor(
      teal[0],
      teal[1],
      teal[2]
    );

    pdf.rect(
      margin,
      startY,
      tableWidth,
      headerHeight,
      'F'
    );

    pdf.setDrawColor(
      teal[0],
      teal[1],
      teal[2]
    );

    pdf.rect(
      margin,
      startY,
      tableWidth,
      headerHeight,
      'S'
    );

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);

    pdf.setTextColor(
      white[0],
      white[1],
      white[2]
    );

    headers.forEach(
      (header: string, index: number) => {

        if (index === 0) {

          pdf.text(
            header,
            colX[index] + 5,
            startY + 17
          );

        } else {

          pdf.text(
            header,
            colX[index + 1] - 4,
            startY + 17,
            { align: 'right' }
          );
        }
      }
    );

    pdf.setTextColor(
      black[0],
      black[1],
      black[2]
    );
  };

  // ----------------------------------------
  // TABLE ROW
  // ----------------------------------------

  const drawTableRow = (
    row: any,
    startY: number
  ): number => {

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);

    const productName =
      String(row.name || 'Product');

    const productLines =
      pdf.splitTextToSize(
        productName,
        colWidths[0] - 10
      );

    // Dynamic row height based on product name
    const displayLines =
      productLines.slice(0, 3);

    const lineHeight = 10;

    const rowHeight = Math.max(
      24,
      displayLines.length * lineHeight + 10
    );

    // Draw row border
    pdf.setDrawColor(
      borderColor[0],
      borderColor[1],
      borderColor[2]
    );

    pdf.setLineWidth(0.5);

    pdf.rect(
      margin,
      startY,
      tableWidth,
      rowHeight,
      'S'
    );

    const textY =
      startY + Math.min(
        15,
        rowHeight / 2 + 3
      );

    // Product name
    pdf.text(
      displayLines,
      colX[0] + 5,
      startY + 12
    );

    // Quantity
    pdf.text(
      String(row.qty),
      colX[2] - 4,
      textY,
      { align: 'right' }
    );

    // Price
    pdf.text(
      Number(row.price).toFixed(2),
      colX[3] - 4,
      textY,
      { align: 'right' }
    );

    // Taxable value
    pdf.text(
      Number(row.taxableValue).toFixed(2),
      colX[4] - 4,
      textY,
      { align: 'right' }
    );

    // GST rate
    pdf.text(
      `${Number(row.gstRate).toFixed(2)}%`,
      colX[5] - 4,
      textY,
      { align: 'right' }
    );

    // GST amount
    pdf.text(
      Number(row.gstValue).toFixed(2),
      colX[6] - 4,
      textY,
      { align: 'right' }
    );

    // Total column
    pdf.setFont('helvetica', 'bold');

    pdf.text(
      Number(row.total).toFixed(2),
      colX[7] - 4,
      textY,
      { align: 'right' }
    );

    pdf.setFont('helvetica', 'normal');

    return rowHeight;
  };

  // ----------------------------------------
  // DRAW TABLE ROWS WITH PAGE BREAKS
  // ----------------------------------------

  drawTableHeader(rowY);

  rowY += headerHeight;

  rows.forEach((row: any) => {

    // Calculate required row height
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);

    const productLines =
      pdf.splitTextToSize(
        String(row.name || 'Product'),
        colWidths[0] - 10
      );

    const estimatedHeight = Math.max(
      24,
      Math.min(productLines.length, 3) * 10 + 10
    );

    // Add new page if row will exceed printable area
    if (rowY + estimatedHeight > bottomLimit) {

      pdf.addPage();

      rowY = 40;

      drawTableHeader(rowY);

      rowY += headerHeight;
    }

    const actualHeight =
      drawTableRow(row, rowY);

    rowY += actualHeight;
  });

  // ----------------------------------------
  // TOTALS SECTION
  // ----------------------------------------

  const totalsHeight = 125;

  if (rowY + totalsHeight > bottomLimit) {

    pdf.addPage();

    rowY = 40;
  }

  const totalsY = rowY + 18;

  const totalsBoxWidth = 220;

  const totalsBoxX =
    pageWidth - margin - totalsBoxWidth;

  const totalsValueX =
    pageWidth - margin - 8;

  const totalsLabelX =
    totalsBoxX + 8;

  // Divider only, no background fill
  pdf.setDrawColor(
    borderColor[0],
    borderColor[1],
    borderColor[2]
  );

  pdf.line(
    totalsBoxX,
    totalsY,
    pageWidth - margin,
    totalsY
  );

  // Subtotal
  pdf.setTextColor(
    black[0],
    black[1],
    black[2]
  );

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);

  pdf.text(
    'Subtotal',
    totalsLabelX,
    totalsY + 20
  );

  pdf.text(
    `Rs. ${Number(summary.subtotal).toFixed(2)}`,
    totalsValueX,
    totalsY + 20,
    { align: 'right' }
  );

  // GST
  pdf.text(
    'GST',
    totalsLabelX,
    totalsY + 38
  );

  pdf.text(
    `Rs. ${Number(summary.gstTotal).toFixed(2)}`,
    totalsValueX,
    totalsY + 38,
    { align: 'right' }
  );

  // Grand Total
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);

  pdf.text(
    'Grand Total',
    totalsLabelX,
    totalsY + 60
  );

  pdf.text(
    `Rs. ${Number(summary.total).toFixed(2)}`,
    totalsValueX,
    totalsY + 60,
    { align: 'right' }
  );

  // ----------------------------------------
  // AMOUNT IN WORDS
  // ----------------------------------------

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);

  pdf.setTextColor(
    60,
    60,
    60
  );

  const amountInWords =
    `Amount in Words: ${summary.totalInWords}`;

  const amountWordsLines =
    pdf.splitTextToSize(
      amountInWords,
      tableWidth
    );

  pdf.text(
    amountWordsLines,
    margin,
    totalsY + 85
  );

  // ----------------------------------------
  // FOOTER
  // ----------------------------------------

  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(9);

  pdf.setTextColor(
    80,
    80,
    80
  );

  pdf.text(
    'Thank you for shopping with RuralX.',
    margin,
    footerY
  );

  pdf.setFontSize(8);

  pdf.text(
    'This is a computer-generated invoice.',
    margin,
    footerY + 15
  );

  return pdf;
}
toTitleCase(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
}

contactEmail() {
    if ((window as any).Android) {
      (window as any).Android.openEmail();
    } else {
      window.location.href =
        'mailto:info@ruralx.in?subject=Support Request';
    }
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
