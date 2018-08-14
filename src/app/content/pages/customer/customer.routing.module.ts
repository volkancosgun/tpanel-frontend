import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerGroupsComponent } from './customer-groups/customer-groups.component';
import { CustomerGroupEditComponent } from './customer-group-edit/customer-group-edit.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { AuthGuard } from '../auth/_guards/auth.guard';


const routes: Routes = [
	{
		path: '',
		component: CustomerListComponent
	},
	{
		path: 'list',
		component: CustomerListComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'create',
		component: CustomerEditComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'edit',
		component: CustomerEditComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'group/create',
		component: CustomerGroupEditComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'group/edit',
		component: CustomerGroupEditComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'groups',
		component: CustomerGroupsComponent,
		canActivate: [AuthGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class CustomerRoutingModule { }