import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../services/api.service';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { AddcartService } from '../services/addcart.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent {
  password: string = '';
  isLoading: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<DeleteAccountComponent>, public toastr: ToastrService,
     private apiService: ApiService, private loginService: LoginService, public router: Router,private addCartService:AddcartService
  ) { }

  deleteAccount() {
    if (!this.password) {
      this.toastr.error('Please enter password');
      return;
    }
    const user = JSON.parse(localStorage.getItem('login_user') || '{}');
    const userId = user.id;

    const payload = {
      user_id: userId,
      password: this.password
    };
    this.isLoading = true;
    this.apiService.deleteAccount(payload)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.dialogRef.close(true);
            this.toastr.success(res?.message);
            this.addCartService.loadCartFromAPI();
            this.loginService.logout();
            this.router.navigate(['/login']);
          } else {
            this.toastr.error(res.message);
            this.dialogRef.close();
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
          const msg = err?.error?.message || `Something went wrong`;
          this.toastr.error(msg, 'Account Deletion Failed');
          this.dialogRef.close();

        }
      });
  }
}
