import { Component } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { AddcartService } from '../services/addcart.service';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-addcart-dailog',
  templateUrl: './addcart-dailog.component.html',
  styleUrls: ['./addcart-dailog.component.css']
})
export class AddcartDailogComponent {
  public addItam:any;
  public selectedSize:any;
  imageBaseUrl = environment.imageBaseUrl;
constructor(@Inject(MAT_DIALOG_DATA) public data: any,public addCartService:AddcartService,private dialogRef: MatDialogRef<AddcartDailogComponent>){
this.addItam = data;
}

ngOnInit(){
  console.log("addItam",this.addItam)
  this.selectedSize = this.addItam?.sizes[1]
}

onSizeSelect(size:any){
  this.selectedSize = size;
}

getVariantLabel(item: any): string {

  if (!item?.sizes || item.sizes.length === 0) return 'Variant';

  const first = item.sizes[0];

  if (first.includes('GB') || first.includes('TB')) {
    return 'Storage';
  }

if (!isNaN(first)) {
    return 'Size';
  }
   // Kids Size (5C, 6C, 1Y, 2Y)
  if (first.match(/^\d+(C|Y)$/)) {
    return 'Size';
  }

const clothSizes = ['XS','S','M','L','XL','XXL','XXXL'];

if (clothSizes.includes(first.toUpperCase())) {
  return 'Size';
}
  return 'Variant';
}

  flyToCart(productImg: HTMLElement) {
    const cartIcon = document.getElementById('cartIconTarget');
    if (!cartIcon || !productImg) return;

    const imgClone = productImg.cloneNode(true) as HTMLElement;
    imgClone.classList.add('fly-img');
    document.body.appendChild(imgClone);

    const start = productImg.getBoundingClientRect();
    const end = cartIcon.getBoundingClientRect();

    // start position
    imgClone.style.left = start.left + 'px';
    imgClone.style.top = start.top + 'px';
    imgClone.style.width = start.width + 'px';
    imgClone.style.height = start.height + 'px';
    imgClone.style.borderRadius = '18px';
    // center of cart icon
    const xMove =
      end.left + end.width / 2 - (start.left + start.width / 2);
    const yMove =
      end.top + end.height / 2 - (start.top + start.height / 2);

    requestAnimationFrame(() => {
      imgClone.style.transform =
        `translate(${xMove}px, ${yMove}px) scale(0.15)`;
      imgClone.style.opacity = '0';
    });
    /* ✨ CART GLOW */
    cartIcon.classList.add('cart-glow', 'cart-bounce');
    setTimeout(() => {
      cartIcon.classList.remove('cart-glow', 'cart-bounce');
    }, 600);

    setTimeout(() => imgClone.remove(), 700);
  }

  flyToCartFromEvent(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    // Find the product card
    const productCard = target.closest('.product-card');
    if (!productCard) return;

    // Find the image inside this card
    const productImg = productCard.querySelector(
      '.product-img'
    ) as HTMLElement;

    if (productImg) {
      this.flyToCart(productImg);
    }

  }

    get currentQty(): number {
    const item = this.addItam?.cartData.find((i: any) => i.id);
    return item?.quantity || 0;
  }

addCart(event:any,addItam:any){
      addItam.cartData.quantity = 1;
      addItam.cartData.userId = addItam?.user?.userId;
      addItam.cartData.isGuest = addItam?.user?.isGuest;
      addItam.cartData.image_url = addItam?.cartData?.variants[0].images;
      addItam.cartData.size = this.selectedSize
      addItam.cartData.color = addItam?.cartData?.variants[0].color
      addItam = addItam?.cartData
      this.addCartService.addToCart(addItam)
      this.flyToCartFromEvent(event);
      this.dialogRef.close();
}
}
