import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private router: Router) {}

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    //handle your auth error or rethrow
    if (err.status === 401 || err.status === 403) {
      // console.log(err.status);
      //navigate /delete cookies or whatever
      if (!this.router.url.toString().includes('login')) {
        this.router.navigate(['/logout']);
      }
      // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
      return of(err.message); // or EMPTY may be appropriate here
    } else {
      return throwError(err);
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to add the new header.
    //const authReq = req.clone({headers: req.headers.set(Cookie.tokenKey, Cookie.getToken())});
    // catch the error, make specific functions for catching specific errors and you can chain through them with more catch operators
    const securityId = sessionStorage.getItem('securityId');
    if (securityId) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${securityId}` },
      });
    }
    return next.handle(req).pipe(catchError((x) => this.handleAuthError(x))); //here use an arrow function, otherwise you may get "Cannot read property 'navigate' of undefined" on angular 4.4.2/net core 2/webpack 2.70
  }
}
