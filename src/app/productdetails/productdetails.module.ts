import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductdetailsRoutingModule } from './productdetails-routing.module';
import { ProductdetailsComponent } from './productdetails/productdetails.component';


@NgModule({
  declarations: [
    ProductdetailsComponent
  ],
  imports: [
    CommonModule,
    ProductdetailsRoutingModule
  ]
})
export class ProductdetailsModule { }
