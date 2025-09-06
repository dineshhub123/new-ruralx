import { NgModule } from '@angular/core'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
  ],
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  exports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
})
export class SharedModule {}
