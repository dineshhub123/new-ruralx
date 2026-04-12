import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAccountComponent } from '../delete-account/delete-account.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent {
 constructor(private dialog: MatDialog, public router:Router ) {}

openDeleteDialog() {
  const dialogRef = this.dialog.open(DeleteAccountComponent, {
    width: '350px'
  });

  dialogRef.afterClosed().subscribe(res => {
    if (res) {
      // 👉 Account deleted → logout user
      this.router.navigate(['/login']);
    }
  });
}}



