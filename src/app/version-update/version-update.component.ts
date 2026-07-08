import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-version-update',
  templateUrl: './version-update.component.html',
  styleUrls: ['./version-update.component.css']
})
export class VersionUpdateComponent {

  currentVersion = '1.0.0';
  latestVersion = '1.1.0';

  features = [
    'Better performance and speed',
    'Bug fixes and stability improvements',
    'Enhanced user experience'
  ];

  constructor(
    private dialogRef: MatDialogRef<VersionUpdateComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }

  updateApp() {
    // Redirect to Play Store or APK URL
    window.open(
      'https://play.google.com/store/apps/details?id=com.ruralx.app',
      '_blank'
    );
  }
}