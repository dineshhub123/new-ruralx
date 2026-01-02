import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class BackButtonService {

  private popupOpenFn?: () => boolean;
  private popupCloseFn?: () => void;

  private lastBackPress = 0;
  private exitDelay = 2000;

  constructor(private router: Router) {

    // Listen only to REAL hardware/browser back
    window.addEventListener('popstate', () => {
      this.handleBack(true);
    });
  }

  registerPopup(isOpen: () => boolean, close: () => void) {
    this.popupOpenFn = isOpen;
    this.popupCloseFn = close;
  }

  clearPopup() {
    this.popupOpenFn = undefined;
    this.popupCloseFn = undefined;
  }

  /** 🔥 Called by FOOTER BACK BUTTON */
  triggerBack() {
    this.handleBack(false);
  }

  /** Central back logic */
  private handleBack(isHardwareBack: boolean) {

    // 1️⃣ Close popup
    if (this.popupOpenFn?.()) {
      this.popupCloseFn?.();
      history.pushState(null, '', window.location.href);
      return;
    }      console.log("hhh")


    // 2️⃣ Home → double back exit
    if (this.router.url === '/' || this.router.url === '/dashboard') {
      const now = Date.now();
      console.log("hhh")

      if (now - this.lastBackPress < this.exitDelay) {
        if (window.matchMedia('(display-mode: standalone)').matches) {
          window.close();
                console.log("hhh")

        }
      } else {
        this.lastBackPress = now;
        alert('Press back again to exit');
        history.pushState(null, '', window.location.href);
              console.log("hhh")

      }
      return;
    }

    // 3️⃣ NORMAL BACK
    if (!isHardwareBack) {
      console.log("hhh")
      // 👈 Footer back button
      history.back(); // 🔥 THIS WAS MISSING
    }
    // If hardware back → browser already moved history
  }
}
