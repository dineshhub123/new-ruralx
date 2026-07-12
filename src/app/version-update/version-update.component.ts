import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-version-update',
  templateUrl: './version-update.component.html',
  styleUrls: ['./version-update.component.css']
})
export class VersionUpdateComponent {

  features = [
    'Better performance and speed',
    'Bug fixes and stability improvements',
    'Enhanced user experience'
  ];
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    currentVersion: string;
    latestVersion: string;
  }, private dialogRef: MatDialogRef<VersionUpdateComponent>
  ) { }

  close() {
    this.dialogRef.close();
    (window as any).Android?.setPullToRefreshEnabled?.(true);
  }
updateApp() {
  (window as any).Android.openApk(
    'https://www.ruralx.in/download-app/app-debug.apk'
  );
}
}