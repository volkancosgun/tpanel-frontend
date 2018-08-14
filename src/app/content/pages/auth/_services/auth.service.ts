import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from "rxjs";

import { TokenService } from "./token.service";
import { balamir } from "../../../../../environments/balamir";

@Injectable()
export class AuthService {

	private loggedIn = new BehaviorSubject<boolean>(this.Token.loggedIn());
	authStatus = this.loggedIn.asObservable();
	changeAuthStatus(value: boolean) {
		this.loggedIn.next(value);
	}
	constructor(
		private http: HttpClient,
		private Token: TokenService
	) {
	}

	login(data) {
		return this.http.post(`${balamir.API_URL}/login`, data);
	}

	me() {
		if (this.Token.loggedIn) {
			let token = this.Token.get();
			return this.http.post(`${balamir.API_URL}/me`, { token: token });
		}
	}

	logout() {

	}
}