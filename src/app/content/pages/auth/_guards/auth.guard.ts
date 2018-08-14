import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
//import { UserService } from "../_services/user.service";
import { Observable } from "rxjs/Rx";
import { TokenService } from "../_services/token.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private _router: Router,
        //private _userService: UserService,
        private token: TokenService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

        if (this.token.loggedIn()) {
            return this.token.loggedIn();
        }

        this._router.navigateByUrl('auth/login');
        return false;
    }
}