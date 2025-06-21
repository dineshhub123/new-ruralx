import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductlistRoutingModule } from './productlist-routing.module';
import { ProductlistComponent } from './productlist/productlist.component';


@NgModule({
  declarations: [
    ProductlistComponent
  ],
  imports: [
    CommonModule,
    ProductlistRoutingModule
  ]
})
export class ProductlistModule { }
