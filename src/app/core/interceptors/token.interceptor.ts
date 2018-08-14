import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { balamir } from '../../../environments/balamir';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const reqUrl: Array<any> = req.url.split('/');
        const apiUrl: Array<any> = balamir.API_URL.split('/');
        const token = localStorage.getItem('token');

        if (token && (reqUrl[2] === apiUrl[2])) {
            const newReq = req.clone({ setHeaders: { 'Authorization': `Bearer ${token}` } });
            return next.handle(newReq);
        } else {
            return next.handle(req);
        }
    }
}