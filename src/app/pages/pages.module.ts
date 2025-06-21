import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewComponent } from './orders/new/new.component';
import { ShippedComponent } from './orders/shipped/shipped.component';
import { CancelledComponent } from './orders/cancelled/cancelled.component';
// import { AllComponent } from './products/all/all.component';
import { AddComponent } from './products/add/add.component';
import { CategoriesComponent } from './products/categories/categories.component';
import { CustomersComponent } from './customers/customers.component';
import { ReportsComponent } from './reports/reports.component';
import { SettingsComponent } from './settings/settings.component';
import { ProcessingComponent } from './orders/processing/processing.component';
import { DeliveredComponent } from './orders/delivered/delivered.component';
import { ReturnedComponent } from './orders/returned/returned.component';
import { BrandsComponent } from './products/categories/brands/brands.component';
import { LowstockComponent } from './products/lowstock/lowstock.component';
import { ReviewComponent } from './customers/review/review.component';
//import { SalereportsComponent } from './reports/salereports/salereports.component';
import { StoresettingsComponent } from './settings/storesettings/storesettings.component';
import { SecurityComponent } from './settings/storesettings/security/security.component';
import { ReviewsComponent } from './customers/reviews/reviews.component';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { NgxEchartsModule } from 'ngx-echarts';


@NgModule({
  declarations: [
    DashboardComponent,
    NewComponent,
    ShippedComponent,
    CancelledComponent,
    // AllComponent,
    AddComponent,
    CategoriesComponent,
    CustomersComponent,
    ReportsComponent,
    SettingsComponent,
    ProcessingComponent,
    DeliveredComponent,
    ReturnedComponent,
    BrandsComponent,
    LowstockComponent,
    ReviewComponent,
    //SalereportsComponent,
    StoresettingsComponent,
    SecurityComponent,
    ReviewsComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule, 
   HttpClientModule,
   MatPaginatorModule,
   BrowserAnimationsModule, 
   MatTableModule, 
  NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ]
})
export class PagesModule { }
