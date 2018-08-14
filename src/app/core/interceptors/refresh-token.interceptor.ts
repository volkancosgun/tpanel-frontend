import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/throw';

import { Router } from '@angular/router';
import { balamir } from '../../../environments/balamir';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

    constructor(private injector: Injector, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).catch((errorResponse: HttpErrorResponse) => {

            const error = (typeof errorResponse.error !== 'object') ? JSON.parse(errorResponse.error) : errorResponse;
            console.log(error.error.message);
            if (errorResponse.status === 401 && error.error.message === 'Unauthenticated.') {
                const http = this.injector.get(HttpClient);
                localStorage.removeItem('token');
                this.router.navigate(['/auth/login']);
            }

            return Observable.throw(errorResponse);
        })
    }
}