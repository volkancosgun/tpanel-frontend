import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { ActionComponent } from './header/action/action.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ProfileComponent } from './header/profile/profile.component';
import { ErrorPageComponent } from './snippets/error-page/error-page.component';
import { AuthGuard } from './auth/_guards/auth.guard';
import { BeforeAuthGuard } from './auth/_guards/before-auth.guard';


const routes: Routes = [
	{
		path: '',
		component: PagesComponent,
		children: [
			{
				path: 'index',
				loadChildren: './dashboard/dashboard.module#DashboardModule',
				canActivate: [AuthGuard]
			},
			{
				path: 'customer',
				loadChildren: './customer/customer.module#CustomerModule',
				canActivate: [AuthGuard]
			},
			{
				path: 'product',
				loadChildren: './product/product.module#ProductModule',
				canActivate: [AuthGuard]
			},
			{
				path: 'order',
				loadChildren: './order/order.module#OrderModule',
				canActivate: [AuthGuard]
			},
			{
				path: 'stock',
				loadChildren: './stock/stock.module#StockModule',
				canActivate: [AuthGuard]
			},
			{
				path: 'settings',
				loadChildren: './settings/settings.module#SettingsModule',
				canActivate: [AuthGuard]
			},
			{
				path: 'builder',
				loadChildren: './builder/builder.module#BuilderModule'
			},
			{
				path: 'header/actions',
				component: ActionComponent
			},
			{
				path: 'profile',
				component: ProfileComponent,
				canActivate: [AuthGuard]
			},
			{
				path: '',
				redirectTo: 'index',
				pathMatch: 'full',
			},
		]
	},
	{
		path: '404',
		component: ErrorPageComponent
	},
	{
		path: 'error/:type',
		component: ErrorPageComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PagesRoutingModule { }
