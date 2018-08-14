import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/_guards/auth.guard';
import { LayoutModule } from '../../layout/layout.module';
import { AuthService } from '../auth/_services/index';


@NgModule({
	imports: [
		CommonModule,
		LayoutModule,
		RouterModule.forChild([
			{
				path: '',
				component: DashboardComponent,
				canActivate: [AuthGuard]
			}
		])
	],
	declarations: [
		DashboardComponent
	],
	providers: [
	]
})
export class DashboardModule { }
