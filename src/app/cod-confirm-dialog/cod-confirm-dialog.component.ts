import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cod-confirm-dialog',
  templateUrl: './cod-confirm-dialog.component.html',
  styleUrls: ['./cod-confirm-dialog.component.css']

})
export class CodConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CodConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}