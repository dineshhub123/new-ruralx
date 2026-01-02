import { Component, OnInit,ElementRef,Renderer2 ,ViewChild,HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { AddcartService } from '../services/addcart.service';

@Component({
  selector: 'app-display-search-item',
  templateUrl: './display-search-item.component.html',
  styleUrls: ['./display-search-item.component.css']
})
export class DisplaySearchItemComponent implements OnInit {
  @HostListener('window:scroll', [])

  public searchItem: any;
  public items: any;
  public addCartData: any;
  public hideHeader:boolean = false;
  lastScrollTop = 0;
  MAX_QTY = 4;
 flyCartIncreament:any
  constructor(public router: Router, public addCartService: AddcartService) {

  }
  ngOnInit() {
    this.itemInitilize();
  }

onWindowScroll() {
  const currentScroll =
    window.pageYOffset || document.documentElement.scrollTop;
console.log("currentScroll",currentScroll)
  // Always show header at top
  if (currentScroll <= 0) {
    this.hideHeader = false;
    return;
  }

  // Scroll down → hide
  if (currentScroll > this.lastScrollTop && currentScroll > 80) {
    this.hideHeader = true;
  }
  // Scroll up → show
  else if (currentScroll < this.lastScrollTop) {
    this.hideHeader = false;
  }

  this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
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
  if (this.currentQty >= this.MAX_QTY) {
    return;
  }
  const target = event.currentTarget as HTMLElement;

  // Find the product card
  const productCard = target.closest('.product-card');
  if (!productCard) return;

  // Find the image inside this card
  const productImg = productCard.querySelector(
    '.product-image'
  ) as HTMLElement;

  if (productImg) {
    this.flyToCart(productImg);
  }

}
get currentQty(): number {
  const item = this.searchItem.find( (i:any) =>i.id);  
  return item?.quantity || 0;
}

  itemInitilize() {
    let data: any;
    data = localStorage.getItem('displaySearchData')
    this.searchItem = JSON.parse(data);
  }
  ngAfterViewInit() {

  }
  imgClick(item: any) {
    localStorage.setItem('selected-item', JSON.stringify(item))
    this.router.navigate(['pzoom'])
  }
  addCartQuntity(addItam: any) {
    let user:any;
    user = localStorage.getItem("login_user");
    let findUser = JSON.parse(user)
    addItam.quantity = 1;
    addItam.userId = findUser?.userId;
    addItam.isGuest = findUser?.isGuest;
    addItam.image_url = addItam?.variants[0].images;
    addItam.size = addItam?.variants[0].size
    addItam.color = addItam?.variants[0].color
    //addItam.variants = []
    this.addCartService.addToCart(addItam)
  }


  decrement(decItem: any) {
    if (decItem.quantity > 0) {
      decItem.quantity--;
    }
    let deleteItem: any = {};
    deleteItem = localStorage.getItem('cart_items')
    let diTtem = JSON.parse(deleteItem)
    let index = diTtem.findIndex((x: any) => x?.id === decItem?.id && x?.userId === decItem?.userId && x.color === decItem.color)
    if (index !== -1) {
      if (decItem.quantity === 0) {
        diTtem.splice(index, 1);
      } else {
        diTtem[index].quantity = decItem.quantity;
      }
    }
    localStorage.setItem('cart_items', JSON.stringify(diTtem))
    this.addCartService.removeCart();
    this.searchItem = JSON.parse(diTtem)

    setTimeout(() => {
      this.reloadCurrentRoute();
    }, 5)

  }
  increment(incrItem: any) {
    if (incrItem.quantity < this.MAX_QTY) {
       this.flyCartIncreament =  incrItem.quantity++;
        }
    let addItem: any = {};
    addItem = localStorage.getItem('cart_items')
    let incItem = JSON.parse(addItem)
    let findObj = incItem.find((x: any) => x?.id === incrItem?.id && x?.userId === incrItem?.userId && x.color === incrItem.color)
    if (findObj) {
      findObj.quantity = incrItem.quantity;
    } else {
      incItem.push({
        ...incrItem,
        quantity: incrItem.quantity
      });
    }
    localStorage.setItem('cart_items', JSON.stringify(incItem))
    this.addCartService.removeCart();
    this.searchItem = JSON.parse(incItem)
    setTimeout(() => {
      this.reloadCurrentRoute();
    }, 5)

  }
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

}

