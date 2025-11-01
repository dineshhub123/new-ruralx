import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
// import { environment } from 'src/environments/environment'; 
import { MaterialModule } from './shared/material.module';
import { SharedModule } from './shared/shared.module';
//import { DashboardModule } from './dashboard/dashboard.module';
import { ErrorModule } from './error/error.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginModule } from './login/login.module';
import { SignupModule } from './signup/signup.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import {AngularEditorModule } from '@kolkov/angular-editor';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxEchartsModule } from 'ngx-echarts';
import { DailogComponent } from './dailog/dailog.component';
import { ProductZoomComponent } from './product-zoom/product-zoom.component';
import { ReplacePathPipe } from './custom-pipes/replace-path.pipe';
import { DisplaySearchItemComponent } from './display-search-item/display-search-item.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { AddcartComponent } from './addcart/addcart.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthGuard } from './services/auth.guard';
import { SignupComponent } from './signup/signup.component';
import { UseraddressComponent } from './useraddress/useraddress.component';
import { DeliverystatusComponent } from './deliverystatus/deliverystatus.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SwiperModule } from 'swiper/angular';
import SwiperCore, { Zoom,Thumbs, Pagination } from 'swiper';
import { CategoryComponent } from './category/category.component';
import {MatTabsModule} from '@angular/material/tabs';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { LoaderComponent } from './loader/loader.component';
// Register Swiper modules
SwiperCore.use([Zoom,Thumbs, Pagination]);


// Register modules

@NgModule({
  declarations: [
    AppComponent,
    DailogComponent,ProductZoomComponent,DisplaySearchItemComponent,HeaderComponent,
    HeaderComponent,FooterComponent,AddcartComponent,UseraddressComponent,DashboardComponent,
    ReplacePathPipe, CategoryComponent, LoaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    SharedModule,
    CommonModule,MatButtonModule, MatBottomSheetModule,
    //DashboardModule,
    ErrorModule,
    LoginModule,
    SignupModule,
    HttpClientModule,
    AngularEditorModule,
    MatMenuModule, 
    MatListModule, 
    SwiperModule,
    MatBadgeModule,  
    MatTooltipModule,MatDialogModule,
    MatExpansionModule,
    MatTabsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right', // 👈 BOTTOM RIGHT
      timeOut: 5000,                        // optional: duration in ms
      closeButton: true,                    // optional: close button
      progressBar: true                     // optional: progress bar
    }), // ToastrModule added
    
    BrowserAnimationsModule
  ],
  
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
