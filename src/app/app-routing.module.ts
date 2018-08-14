import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeforeAuthGuard } from './content/pages/auth/_guards/before-auth.guard';
import { AuthGuard } from './content/pages/auth/_guards/auth.guard';

const routes: Routes = [
	{
		path: 'auth',
		loadChildren: 'app/content/pages/auth/auth.module#AuthModule',
		canActivate: [BeforeAuthGuard]
	},
	/* { path: '', redirectTo: 'index', pathMatch: 'full' }, */
	{
		path: '',
		loadChildren: 'app/content/pages/pages.module#PagesModule',
		canActivate: [AuthGuard]
	},
	{
		path: '**',
		redirectTo: '404',
		pathMatch: 'full'
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
