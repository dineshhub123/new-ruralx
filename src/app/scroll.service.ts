import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScrollService {

  // 🔹 Existing scroll stream (keep it)
  private scrollSubject = new Subject<number>();
  scroll$ = this.scrollSubject.asObservable();

  // 🔹 Header visibility stream
  private hideHeaderSubject = new BehaviorSubject<boolean>(false);
  hideHeader$ = this.hideHeaderSubject.asObservable();

  // 🔹 Popup state
  isPopupOpen = false;

  private lastScrollTop = 0;

  emit(scrollTop: number) {
    // still emit raw scroll value
    this.scrollSubject.next(scrollTop);

    // If popup is open → ALWAYS keep header hidden
    if (this.isPopupOpen) {
      this.hideHeaderSubject.next(true);
      return;
    }

    // Always show header at top
    if (scrollTop <= 0) {
      this.hideHeaderSubject.next(false);
      this.lastScrollTop = 0;
      return;
    }

    // Scroll down → hide header
    if (scrollTop > this.lastScrollTop && scrollTop > 80) {
      this.hideHeaderSubject.next(true);
    }
    // Scroll up → show header
    else if (scrollTop < this.lastScrollTop) {
      this.hideHeaderSubject.next(false);
    }

    this.lastScrollTop = scrollTop;
  }

  /** Call when popup/dialog opens */
  openPopup() {
    this.isPopupOpen = true;
    this.hideHeaderSubject.next(true);
  }

  /** Call when popup/dialog closes */
  closePopup() {
    this.isPopupOpen = false;
    this.hideHeaderSubject.next(false);
  }
}
