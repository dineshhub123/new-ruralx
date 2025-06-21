import { Component, OnInit, Inject, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
//import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DailogComponent } from '../dailog/dailog.component';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { AddcartService } from '../addcart.service';
@Component({
  selector: 'app-product-zoom',
  templateUrl: './product-zoom.component.html',
  styleUrls: ['./product-zoom.component.css']
})
export class ProductZoomComponent implements OnInit {
  

  public data: any;
  res: any;
  public zoomId: any;
  public child: any = true;
  public childImg: any;
  public childImgTop: any;
  public childImgSide: any;
  public childImgBack: any;
  public childImgFront: any;
  public childImgFrontTri: any;
  public searchName: string = "";
  public quantity: any;
  public name: any;
  public animal: any;
  public cartItem: any
  public counter: number = 1;

  increment() {
    this.counter += 1;
  }

  decrement() {
    if (this.counter > 0) {
      this.counter--;
    }
  }

  enableZoom: Boolean = true;
  previewImageSrc = "";
  zoomImageSrc = "assets/img/niya1.png";
  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public addCartService: AddcartService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    let itemZoom: any;
    itemZoom = localStorage.getItem('selected-item')
    this.cartItem = JSON.parse(itemZoom)
    // this.http.get("http://localhost/employee.php").subscribe(data => {
    // this.data.push(data);
    // }, 
    // error => console.error(error));

  }
  openDialog_(): void {
    const dialogRef = this.dialog.open(DailogComponent, {
      width: '250px',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }
  getCart: any = []
  ngOnInit() {
  }
  ChildMasterDisplay(master: any) {
    this.cartItem.img_front = master;

  }
  ChildTopDisplay(top: any) {
    this.cartItem.img_front = top;

  }
  ChildSideDisplay(side: any) {
    this.cartItem.img_front = side;

  }
  ChildBackDisplay(back: any) {
    this.cartItem.img_front = back;

  }
  ChildTriangleDisplay(triangle: any) {
    this.cartItem.img_front = triangle;

  }
  ChildFrontDisplay(front: any) {
    this.cartItem.img_front = front;

  }
  addCartItem: any = []


  addCart(cartData: any) {
    cartData["quantity"] = this.counter
    this.addCartService.addToCart(cartData)
  }
  addDetails() {
    this.router.navigate(['./useraddress'])
  }
}

export interface Product {
  id:number,
  category:string,
  delivery_date:number,
  img_front:string,
  product_description:string,
  product_discount:number,
  product_mrp_price:number,
  product_name:string,
  product_price:number
}