import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { HttpClient } from '@angular/common/http';

import { User } from "../_models/index";
import { balamir } from "../../../../../environments/balamir";

@Injectable()
export class UserService {
    constructor(private http: Http, private _http: HttpClient) {
    }

    verify() {
        return this.http.get('/api/verify', this.jwt()).map((response: Response) => response.json());
    }

    forgotPassword(email: string) {
        return this.http.post('/api/forgot-password', JSON.stringify({ email }), this.jwt()).map((response: Response) => response.json());
    }

    getAll() {
        return this.http.get('/api/users', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(data) {
        return this._http.post(`${balamir.API_URL}/signup`, data);
    }

    sendPasswordResetLink(data) {
        return this._http.post(`${balamir.API_URL}/sendPasswordResetLink`, data);
    }

    changePassword(data) {
        return this._http.post(`${balamir.API_URL}/resetPassword`, data);
    }

    /* create(user: User) {
        return this.http.post('/api/users', user, this.jwt()).map((response: Response) => response.json());
    } */

    update(user: User) {
        return this.http.put('/api/users/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }
}