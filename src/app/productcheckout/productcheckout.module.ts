import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductcheckoutRoutingModule } from './productcheckout-routing.module';
import { ProductcheckoutComponent } from './productcheckout/productcheckout.component';


@NgModule({
  declarations: [
    ProductcheckoutComponent
  ],
  imports: [
    CommonModule,
    ProductcheckoutRoutingModule
  ]
})
export class ProductcheckoutModule { }
