import { NgModule } from '@angular/core'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  
import { MaterialModule } from './material.module';
import { FooterComponent } from './layout/footer/footer.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { TopbarComponent } from './layout/topbar/topbar.component';

@NgModule({
  declarations: [
    FooterComponent,
    SidenavComponent,
    TopbarComponent
  ],
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  exports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
})
export class SharedModule {}
