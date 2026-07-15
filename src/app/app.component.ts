import { Component, NgZone, Renderer2, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { ApiService } from './services/api.service';
import { LoginService } from './services/login.service';
import { Location, ViewportScroller } from '@angular/common';
import { FormControl } from '@angular/forms';
import { DailogComponent } from './dailog/dailog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddcartService } from './services/addcart.service';
import { Product } from './product-zoom/product-zoom.component';
import { ToastrService } from 'ngx-toastr';
import { ScrollService } from './scroll.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { TranslateService } from '@ngx-translate/core';
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { VersionUpdateComponent } from './version-update/version-update.component';
declare var Android: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  title = 'material-ui-angular';
  username: string | null = null;
  expandedPanel: string = '';
  @ViewChild('searchValue') input: any;
  myControl = new FormControl();
  public data: any;
  public filteredOptions: any = [];
  public name: any;
  public cartItems: Product[] = [];
  options: string[] = [];
  public retrieveResonse: any;
  public itemQuantity: number = 0;
  public base64Data: any;
  public retrievedImage: any;
  public imageUrl = null;
  public selectedFile: any;
  public sellItemData: any
  public buyerUsername: any;
  public getNotifyUserArray: any;
  private sub = new Subscription();
  public hideHeader: boolean = false;
  public lastScrollTop = 0;
  public isDesktop: boolean = false;
  public isGuest = true;
  selectedLanguage: string = 'en';
  showUsername: boolean = true;
  currentVersion = '';
  latestVersion = '1.3.0';
  constructor(private renderer: Renderer2, private zone: NgZone, public dialog: MatDialog, public location: Location, public addCartService: AddcartService, private toastr: ToastrService, private translate: TranslateService,
    public loginService: LoginService,
    public router: Router,
    private http: HttpClient,
    private _DomSanitizationService: DomSanitizer,
    public apiService: ApiService,
    private viewportScroller: ViewportScroller,
    private scrollService: ScrollService,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.smoothScrollToTop(500);
        }, 200);
        //this.setExpandedPanel(event.urlAfterRedirects);
      }
    });
    this.apiService.getProductListDetailsData().subscribe((data: any) => {
      let searchList = data.map((item: any) => item.category);
      let removeDuplicateArr = new Set(searchList)
      let filterArray: any = [...removeDuplicateArr]
      this.options = filterArray;
    },
      error => console.error(error));
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  smoothScrollToTop(duration = 500) {
    const el = document.querySelector('.main-content') as HTMLElement | null;
    const container = el ? el : window;
    const start = container === window
      ? window.scrollY
      : (container as HTMLElement).scrollTop;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const time = Math.min(1, (currentTime - startTime) / duration);
      const scrollTo = start * (1 - time);
      if (container === window) {
        window.scrollTo(0, scrollTo);
      } else {
        (container as HTMLElement).scrollTop = scrollTo;
      }
      if (time < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }
  compareVersions(v1: string, v2: string): number {
    const a = v1.split('.').map(Number);
    const b = v2.split('.').map(Number);

    const max = Math.max(a.length, b.length);

    for (let i = 0; i < max; i++) {
      const x = a[i] || 0;
      const y = b[i] || 0;

      if (x > y) return 1;
      if (x < y) return -1;
    }
    return 0;
  }
  checkForUpdate() {
  if (this.currentVersion && this.latestVersion) {
    if (this.compareVersions(this.latestVersion, this.currentVersion) > 0) {
      this.openVersionDailog();
    }
  }
}
  ngOnInit(): void {
    window.addEventListener('androidAppInfo', () => {
      const appInfo = (window as any).AndroidAppInfo;
      if (appInfo) {
        this.currentVersion = appInfo.versionName;
        this.checkForUpdate();
      }
    });

    window.addEventListener('load', () => {
      const splash = document.getElementById('app-splash');
      // Browser me hamesha splash dikhao
      if (!(window as any).Android) {
        setTimeout(() => {
          splash?.classList.add('hide');
          setTimeout(() => splash?.remove(), 500);
        }, 1500);
        return;
      }
      // Android App
      if (sessionStorage.getItem('splashShown')) {
        splash?.remove();
        return;
      }
      sessionStorage.setItem('splashShown', 'true');
      setTimeout(() => {
        splash?.classList.add('hide');
        setTimeout(() => splash?.remove(), 500);
      }, 1500);
    });


    const saved = localStorage.getItem('language');
    this.selectedLanguage =
      saved === 'hi' ? 'hi' : 'en';

    this.loginService.user$.subscribe(user => {
      if (user) {
        this.calculateUserCartQuantity(user);
      }
    });
    this.scrollService.hideHeader$.subscribe(val => {
      this.hideHeader = val;
    });
    this.checkScreen();
    window.addEventListener('resize', () => this.checkScreen());

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(),
      map(value => this._filter(value || '')),
    );
    this.setExpandedPanel(this.router.url);
    this.loginService.user$.subscribe(user => {
      if (!user || user.user_first_name === 'Guest') {
        this.username = 'Sign In';
        this.isGuest = true;
      } else {
        this.username = user.user_first_name;
        this.isGuest = false;
      }
      // allow Google Translate DOM update
      this.showUsername = false;
      setTimeout(() => {
        this.showUsername = true;
      }, 50);
    });

    // Fix for Android Chrome not applying theme color immediately
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (metaThemeColor) {
      // Reset once, then set again to force reapply
      this.renderer.setAttribute(metaThemeColor, 'content', '#ffffff');
      setTimeout(() => {
        this.renderer.setAttribute(metaThemeColor, 'content', '#0a4984');
      }, 100);


    }

  }
  openVersionDailog() {
    this.dialog.open(VersionUpdateComponent, {
      width: '520px',
      maxWidth: '90vw',
      maxHeight: '95vh',
      disableClose: true,
      backdropClass: 'update-backdrop',
      panelClass: 'update-dialog',
      data: {
      currentVersion: this.currentVersion,
      latestVersion: this.latestVersion
    }
    });
    setTimeout(() => {
      (window as any).Android?.setPullToRefreshEnabled?.(false);
    }, 100);
  }

  changeLang(lang: string) {
    console.log(lang)
    this.translate.use(lang);
  }

  checkScreen() {
    this.isDesktop = window.innerWidth >= 769;
  }

  onContentScroll(event: Event) {
    // If laptop/desktop → DO NOTHING
    if (window.innerWidth >= 769) {
      this.hideHeader = false;
      return;
    }

    const scrollTop = (event.target as HTMLElement).scrollTop;

    // ⭐ Android Pull-to-Refresh
    (window as any).Android?.setPullToRefreshEnabled?.(scrollTop <= 0);

    this.scrollService.emit(scrollTop);

    // Always show header at top
    if (scrollTop <= 0) {
      this.hideHeader = false;
      this.lastScrollTop = 0;
      return;
    }

    // Scroll down → hide (MOBILE ONLY)
    if (scrollTop > this.lastScrollTop && scrollTop > 80) {
      this.hideHeader = true;
    }
    // Scroll up → show
    else if (scrollTop < this.lastScrollTop) {
      this.hideHeader = false;
    }

    this.lastScrollTop = scrollTop;
  }
  ngAfterViewInit() {
    (window as any).Android?.setPullToRefreshEnabled?.(true);
  }
  calculateUserCartQuantity(loginUser: any) {
    this.addCartService.cart$.subscribe(items => {
      const userCartItems = items.filter((item: any) => item?.userId === loginUser?.userId);
      this.cartItems = userCartItems;
      let filerCartItems = userCartItems.filter((item: any) => item?.userId === loginUser?.userId)
      this.itemQuantity = filerCartItems.reduce((total: number, item: any) => total + (item?.quantity || 0), 0);
    });

  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  setExpandedPanel(url: string): void {
    if (url.includes('/orders')) {
      this.expandedPanel = 'orders';
    } else if (url.includes('/products')) {
      this.expandedPanel = 'products';
    } else if (url.includes('/customers')) {
      this.expandedPanel = 'customers';
    } else if (url.includes('/reports')) {
      this.expandedPanel = 'reports';
    } else if (url.includes('/settings')) {
      this.expandedPanel = 'settings';
    } else {
      this.expandedPanel = 'dashboard';
    }
  }

  isExpanded(panel: string): boolean {
    return this.expandedPanel === panel;
  }

  userLogout() {
    const user = this.loginService.getUser();
    this.loginService.logout();
    this.addCartService.loadCartFromAPI();
    this.toastr.success(`Thanks, ${user?.user_first_name}! You've been logged out. Visit again soon!`, 'Logged Out');
    const loginUser = this.loginService.getUser();
    this.addCartService.cart$.subscribe(items => {
      const userItems = items.filter((item: any) => item.userId === loginUser?.userId);
      this.itemQuantity = userItems.reduce((sum: number, item: any) => sum + (item?.quantity || 0), 0);
    });
    this.menuTrigger.closeMenu();
    this.router.navigate(['login']);
  }

  notification() {
    this.router.navigate(["sell-notification"]);

  }
  upload() {
    this.router.navigate(["upload"]);
  }
  back(): void {
    this.location.back()
  }

  openNotification() {

  }

  cartFun() {
    this.router.navigate(['addcart'])
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
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openTermsAndConditionDialog() {
    (window as any).Android?.setPullToRefreshEnabled?.(false);
    const dialogRef = this.dialog.open(TermsAndConditionComponent, {
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
    (window as any).Android?.setPullToRefreshEnabled?.(true);
    });

  }
  openPrivacyPolicyDialog() {
    (window as any).Android?.setPullToRefreshEnabled?.(false);
    const dialogRef = this.dialog.open(PrivacyPolicyComponent, {
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
    (window as any).Android?.setPullToRefreshEnabled?.(true);
    });
  }
  ruralxRedirection() {
    if ((window as any).Android) {
      (window as any).Android.openWebsite();
    } else {
      window.open('https://www.ruralx.in', '_blank');
    }
  }
  contactEmail() {
    if ((window as any).Android) {
      (window as any).Android.openEmail();
    } else {
      window.location.href =
        'mailto:info@ruralx.in?subject=Support Request';
    }
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
  changeLanguage(lang: string) {

    this.selectedLanguage = lang;

    localStorage.setItem('language', lang);

    const select: any =
      document.querySelector('.goog-te-combo');

    if (select) {

      select.value = '';

      setTimeout(() => {

        select.value = lang;

        select.dispatchEvent(
          new Event('change', {
            bubbles: true
          })
        );

      }, 200);
    }
  }



  toggleLanguage() {

    // Toggle language
    this.selectedLanguage =
      this.selectedLanguage === 'en'
        ? 'hi'
        : 'en';

    localStorage.setItem(
      'language',
      this.selectedLanguage
    );

    const interval = setInterval(() => {

      const select: any =
        document.querySelector('.goog-te-combo');

      if (select) {

        select.value = this.selectedLanguage;

        select.dispatchEvent(
          new Event('change', {
            bubbles: true
          })
        );

        clearInterval(interval);
      }

    }, 500);
    this.showUsername = false;
    setTimeout(() => {
      this.showUsername = true;
    });

  }
  testVoice() {
    const message =
      'Welcome to Ruralx. Limited stock. Limited stock. Limited stock.';
    if ((window as any).Android) {
      (window as any).Android.speak(message);
    } else {
      console.log('Android bridge not available');
    }

  }

}

