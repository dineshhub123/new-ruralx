import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../shared/material.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReplacePathPipe } from '../custom-pipes/replace-path.pipe';
@NgModule({
  declarations: [DashboardComponent,ReplacePathPipe],
  imports: [
  CommonModule, 
   RouterModule, 
   MaterialModule,
   MatProgressSpinnerModule, 
   FormsModule, 
   MatDatepickerModule,
   MatFormFieldModule,
   MatInputModule,
   MatChipsModule, 
   BrowserAnimationsModule,
   ReactiveFormsModule,
    MatNativeDateModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),

  ],
})
export class DashboardModule {}
