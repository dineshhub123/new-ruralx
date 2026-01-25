import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './shared/material.module';
import { SharedModule } from './shared/shared.module';
import { ErrorModule } from './error/error.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginModule } from './login/login.module';
import { SignupModule } from './signup/signup.module';

import { HttpClientModule,HttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';

import { NgxEchartsModule } from 'ngx-echarts';

import { DailogComponent } from './dailog/dailog.component';
import { ProductZoomComponent } from './product-zoom/product-zoom.component';
import { ReplacePathPipe } from './custom-pipes/replace-path.pipe';
import { DisplaySearchItemComponent } from './display-search-item/display-search-item.component';
import { BottomSheetOverviewExampleSheet, HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AddcartComponent } from './addcart/addcart.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { UseraddressComponent } from './useraddress/useraddress.component';
import { CategoryComponent } from './category/category.component';
import { LoaderComponent } from './loader/loader.component';
import { PaymentOptionsComponent } from './payment-options/payment-options.component';
import { PayQrComponent } from './pay-qr/pay-qr.component';
import { UploadScreenshotComponent } from './upload-screenshot/upload-screenshot.component';
import { PayUpiComponent } from './pay-upi/pay-upi.component';
import { CodConfirmComponent } from './cod-confirm/cod-confirm.component';
import { WaitingVerificationComponent } from './waiting-verification/waiting-verification.component';
import { OrderConfirmedComponent } from './order-confirmed/order-confirmed.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { MyOrderComponent } from './my-order/my-order.component';
import { MyOrderStatusComponent } from './my-order-status/my-order-status.component';
import { SettingComponent } from './setting/setting.component';

import { AuthGuard } from './services/auth.guard';

import { SwiperModule } from 'swiper/angular';
import SwiperCore, { Zoom, Thumbs, Pagination } from 'swiper';
// ✅ Translate loader function
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http:HttpClient){
  return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}

// ✅ Register Swiper modules
SwiperCore.use([Zoom, Thumbs, Pagination]);


@NgModule({
  declarations: [
    AppComponent,
    DailogComponent,
    ProductZoomComponent,
    DisplaySearchItemComponent,
    HeaderComponent,
    FooterComponent,
    AddcartComponent,
    UseraddressComponent,
    DashboardComponent,
    ReplacePathPipe,
    CategoryComponent,
    LoaderComponent,
    BottomSheetOverviewExampleSheet,
    PaymentOptionsComponent,
    PayQrComponent,
    UploadScreenshotComponent,
    PayUpiComponent,
    CodConfirmComponent,
    WaitingVerificationComponent,
    OrderConfirmedComponent,
    ComingSoonComponent,
    MyAccountComponent,
    MyOrderComponent,
    MyOrderStatusComponent,
    SettingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

    // ✅ ngx-translate config (IMPORTANT)
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,

    MaterialModule,
    SharedModule,
    CommonModule,

    MatButtonModule,
    MatBottomSheetModule,
    MatMenuModule,
    MatListModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDialogModule,
    MatExpansionModule,
    MatTabsModule,

    SwiperModule,

    AngularEditorModule,

    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),

    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      timeOut: 5000,
      closeButton: true,
      progressBar: true
    }),

    ErrorModule,
    LoginModule,
    SignupModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
