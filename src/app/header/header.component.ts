import { Component, OnInit, TemplateRef, ViewChild, Inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DailogComponent } from '../dailog/dailog.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import {NgbModal,NgbModalRef, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
//import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { switchMap, debounceTime, tap, finalize } from 'rxjs/operators';
import { User, IUserResponse } from './user.class';
import { Observable, Subscriber } from 'rxjs'
import { ApiService } from '../api.service';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { strings } from '@material/chips/deprecated/trailingaction/constants';
import { DOCUMENT } from '@angular/common';
import { AddcartService } from '../addcart.service';
import { Product } from '../product-zoom/product-zoom.component';
import { LoginService } from '../login.service';
export interface DialogData {
  animal: string;
  name: string;

  //constructor(private dialogRef:MatDialogRef){}

}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('searchValue') input: any;
  myControl = new FormControl();
  //opt: string[] = ['mobile', 'fan', 't-shirt', 'telephone', 'jins', 'bicycle', 'shoes'];
  options: string[] = [];
  public filteredOptions: any = [];
  public name: any;
  public animal: any
  data = [];
  zoomId: any;
  searchName: string = "";
  public cartItems: Product[] = [];
  public formdata: any
  public isMenuOpen: boolean = false
  public itemQuantity: number = 0;
  username: string | null = null;
  constructor(@Inject(DOCUMENT) private document: Document, public addCartService: AddcartService, public loginService: LoginService, private cdRef: ChangeDetectorRef,private zone: NgZone,
    public dialog: MatDialog, private http: HttpClient, public router: Router, private fb: FormBuilder, private apiService: ApiService) {
    this.apiService.getProductListDetailsData().subscribe((data: any) => {
      let searchList = data.map((item: any) => item.category);
      let removeDuplicateArr = new Set(searchList)
      let filterArray: any = [...removeDuplicateArr]
      this.options = filterArray;
    },
      error => console.error(error));
  }
  get f() { return this.formdata.controls; }
  ngOnInit() {
     this.loginService.username$.subscribe((name: any) => {
        this.zone.run(() => {
      this.username = name;
        });
    });
    this.addCartService.cart$.subscribe(items => {
      this.cartItems = items
      this.cartItems = this.addCartService.getCart();
      let quant = this.cartItems.map((qty: any) => qty?.quantity)
      this.itemQuantity = quant.reduce((a: any, b: any) => a + b, 0)
    })

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(),
      map(value => this._filter(value || '')),
    );
  }
  ngAfterViewInit() {

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  onSidenavClick(isMenuOpen: any) {
    //this.isMenuOpen = false;
    console.log('isMenuOpen.....', isMenuOpen)
    if (isMenuOpen) {
      this.document.body.classList.remove('no-scroll');
    } else if (!isMenuOpen) {
      this.document.body.classList.add('no-scroll');

    }
  }
  openCloseSidepanel(ev: any) {

  }
  searchDataFn(searchData: any) {
    let searchValue = this.options.find(value => value === searchData)
    if (searchValue) {
      let userData = {
        searchData: searchValue
      };
      this.apiService.searchData(userData).subscribe((res: any) => {
        let displaySearchData = res;
        localStorage.setItem('displaySearchData', JSON.stringify(displaySearchData))
        this.router.navigate(['./display-item'])
        setTimeout(() => {
          this.reloadCurrentRoute();
        }, 5)
        this.input.nativeElement.value = '';

      })
    }
  }
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  openDialogD(): void {
    const dialogRef = this.dialog.open(DailogComponent, {
      width: '250px',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }

  cartFun() {
    this.router.navigate(['addcart'])
  }
  searchItem(items: any) {
    console.log(items.value)
  }
  keyword = 'name';
  product = [
    {
      id: 1,
      name: 'Georgia'
    },
    {
      id: 2,
      name: 'Usa'
    },
    {
      id: 3,
      name: 'England'
    }
  ];
  loginPage() {
    this.router.navigate(['login'])
  }
  admin() {
    this.router.navigate(['adminpanel'])

  }

  selectEvent(item: any) {
    // do something with selected item
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  // displayFn(user: User) {
  //   if (user) { return user.name; }
  // }


}
