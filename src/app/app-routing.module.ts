import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './error/page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component'; 
import { AboutComponent } from './about/about/about.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { UploadComponent } from './upload/upload.component';
import { SellNotificationComponent } from './sell-notification/sell-notification.component';
import { NewComponent } from './pages/orders/new/new.component';
import { ShippedComponent } from './pages/orders/shipped/shipped.component';
import { CancelledComponent } from './pages/orders/cancelled/cancelled.component';
import { AllComponent } from './pages/products/all/all.component';
import { AddComponent } from './pages/products/add/add.component';
import { CategoriesComponent } from './pages/products/categories/categories.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ProcessingComponent } from './pages/orders/processing/processing.component';
import { DeliveredComponent } from './pages/orders/delivered/delivered.component';
import { ReturnedComponent } from './pages/orders/returned/returned.component';
import { BrandsComponent } from './pages/products/categories/brands/brands.component';
import { LowstockComponent } from './pages/products/lowstock/lowstock.component';
import { ReviewsComponent } from './pages/customers/reviews/reviews.component';
import { SalereportsComponent } from './pages/reports/salereports/salereports.component';
import { HomeComponent } from './home/home.component';
import { ProductZoomComponent } from './product-zoom/product-zoom.component';
import { AddcartComponent } from './addcart/addcart.component';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { CustomerserviceComponent } from './customerservice/customerservice.component';
import { DeliverystatusComponent } from './deliverystatus/deliverystatus.component';
import { DisplaySearchItemComponent } from './display-search-item/display-search-item.component';
import { LogoutComponent } from './logout/logout.component';
import { SellNotificationlistComponent } from './sell-notificationlist/sell-notificationlist.component';
import { AuthGuard } from './services/auth.guard';
import { TodaydealComponent } from './todaydeal/todaydeal.component';
import { UseraddressComponent } from './useraddress/useraddress.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'about', component: AboutComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'uploadproduct', component: UploadComponent },
  { path: 'customerorder', component: SellNotificationComponent },
  { path: 'orders/new', component: NewComponent },
  { path: 'orders/shipped', component: ShippedComponent },
  { path: 'orders/cancelled', component: CancelledComponent },
  { path: 'orders/processing', component: ProcessingComponent },
  { path: 'orders/delivered', component: DeliveredComponent },
  { path: 'orders/returned', component: ReturnedComponent },
  { path: 'products/all', component: AllComponent },
  { path: 'products/add', component: AddComponent },
  { path: 'products/categories', component: CategoriesComponent },
  { path: 'products/categories/brands', component: BrandsComponent },
  { path: 'products/low-stock', component: LowstockComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'customers/reviews', component: ReviewsComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'reports/sales', component: SalereportsComponent },
  { path: 'settings', component: SettingsComponent },
    {path:"",component:LoginComponent},
      {path:"dashboard",component:DashboardComponent},
      {path:"home",component:HomeComponent},
      {path:"pzoom",component:ProductZoomComponent},
      {path:"addcart",component:AddcartComponent},
      {path:"useraddress",component:UseraddressComponent},
      {path: "todaydeal",component:TodaydealComponent},
      {path: "customer",component:CustomerserviceComponent},
      {path: "deliverystatus",component:DeliverystatusComponent},
      {path: "login",component:LoginComponent},
      {path: "logout",component:LogoutComponent},
      {path: "signup",component:SignupComponent},
      {path: "adminpanel",component:AdminpanelComponent, children: [
        {
          path: '',
          component: UploadComponent
        },

        {
          path: 'sell-notification',
          component: SellNotificationComponent
        }
        ,
         {
          path: 'sell-notificationlist',
          component: SellNotificationlistComponent
        }
      ],
      canActivate: [AuthGuard]
},
      {path: "display-item",component:DisplaySearchItemComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
