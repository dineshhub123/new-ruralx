import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './error/page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ProductZoomComponent } from './product-zoom/product-zoom.component';
import { AddcartComponent } from './addcart/addcart.component';
import { DeliverystatusComponent } from './deliverystatus/deliverystatus.component';
import { DisplaySearchItemComponent } from './display-search-item/display-search-item.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthGuard } from './services/auth.guard';
import { UseraddressComponent } from './useraddress/useraddress.component';
import { CategoryComponent } from './category/category.component';
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: "", component: LoginComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "pzoom", component: ProductZoomComponent },
  { path: "addcart", component: AddcartComponent },
  { path: "useraddress", component: UseraddressComponent },
  { path: "deliverystatus", component: DeliverystatusComponent },
  { path: "login", component: LoginComponent },
  { path: "logout", component: LogoutComponent },
  { path: "signup", component: SignupComponent },
  { path: "category", component: CategoryComponent },
  { path: "display-item", component: DisplaySearchItemComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
