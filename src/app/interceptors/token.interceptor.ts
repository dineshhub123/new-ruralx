import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpEvent
} from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Observable, throwError, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  refresh_token_url = 'https://ruralx.in/api/refresh_token.php';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private loginService: LoginService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.authService.getAccessToken();

    // 🔥 1. DO NOT attach token for refresh API
    if (req.url.includes('refresh_token.php')) {
      return next.handle(req);
    }

    let cloned = req;

    if (token) {
      cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(cloned).pipe(
      catchError((error: HttpErrorResponse) => {

        // 🔥 2. If refresh API itself fails → logout immediately (STOP LOOP)
        if (req.url.includes('refresh_token.php')) {
          this.loginService.logout();
          this.router.navigate(['/login']);
          return throwError(() => error);
        }

        if (error.status === 401) {

          const refreshToken = this.authService.getRefreshToken();

          if (!refreshToken) {
            this.loginService.logout();
            this.router.navigate(['/login']);
            return throwError(() => error);
          }

          // 🔥 Call refresh API
          return this.http.post<any>(this.refresh_token_url, {
            refresh_token: refreshToken
          }).pipe(
            switchMap(res => {

              // ✅ Save new access token
              this.authService.setTokens(res.access_token, refreshToken);

              // 🔁 Retry original request
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${res.access_token}`
                }
              });

              return next.handle(retryReq);
            }),
            catchError(err => {
              // 🔥 FINAL FAIL → LOGOUT
              this.loginService.logout();
              this.router.navigate(['/login']);
              return throwError(() => err);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}