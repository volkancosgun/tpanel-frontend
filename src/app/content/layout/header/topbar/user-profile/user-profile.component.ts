import { ChangeDetectionStrategy, Component, ElementRef, ChangeDetectorRef, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { AuthService, TokenService } from '../../../../pages/auth/_services/index';
import { User } from '../../../../pages/auth/_models/index';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'm-user-profile',
	templateUrl: './user-profile.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements OnInit {
	@HostBinding('class')
	// tslint:disable-next-line:max-line-length
	classes = 'm-nav__item m-topbar__user-profile m-topbar__user-profile--img m-dropdown m-dropdown--medium m-dropdown--arrow m-dropdown--header-bg-fill m-dropdown--align-right m-dropdown--mobile-full-width m-dropdown--skin-light';

	@HostBinding('attr.m-dropdown-toggle') attrDropdownToggle = 'click';

	@Input() avatar: string = './assets/app/media/img/users/default-user.png';
	@Input() avatarBg: SafeStyle = '';

	@ViewChild('mProfileDropdown') mProfileDropdown: ElementRef;
	user: User;
	public loggedIn: boolean;
	constructor(
		private router: Router,
		private sanitizer: DomSanitizer,
		private authService: AuthService,
		private tokenService: TokenService,
		private http: HttpClient,
		private cdr: ChangeDetectorRef
	) { }

	ngOnInit(): void {
		this.authService.authStatus.subscribe(value => this.loggedIn = value);
        this.authService.me().subscribe(
			(data: User) => {
				this.user = data;
				this.cdr.detectChanges();
            }
        );

		if (!this.avatarBg) {
			this.avatarBg = this.sanitizer.bypassSecurityTrustStyle('url(./assets/app/media/img/misc/user_profile_bg.jpg)');
		}
	}

	public logout() {

		this.tokenService.remove();

		this.authService.changeAuthStatus(false);

		this.router.navigateByUrl('/auth/login');
	}
}
