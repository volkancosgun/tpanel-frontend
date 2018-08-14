import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {
	MatButtonModule,
	MatFormFieldModule,
	MatInputModule,
	MatCheckboxModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerButtonModule } from '../../partials/content/general/spinner-button/spinner-button.module';
import { AuthNoticeComponent } from './auth-notice/auth-notice.component';
import { AuthGuard } from './_guards/auth.guard';
import { BeforeAuthGuard } from './_guards/before-auth.guard';
import { AuthRoutingModule } from './auth.routing.module';
import { AuthService } from './_services/index';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
		MatCheckboxModule,
		TranslateModule.forChild(),
		SpinnerButtonModule,
		AuthRoutingModule
	],
	providers: [
		AuthGuard,
		BeforeAuthGuard,
		AuthService
	],
	declarations: [
		AuthComponent,
		LoginComponent,
		RegisterComponent,
		ForgotPasswordComponent,
		AuthNoticeComponent
	]
})
export class AuthModule {}
