import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderEditComponent } from './order-edit/order-edit.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';

const routes: Routes = [
	{
		path: '',
		component: OrderListComponent
	},
	{
		path: 'list',
		component: OrderListComponent
	},
	{
		path: 'create',
		component: OrderEditComponent
	},
	{
		path: 'edit',
		component: OrderEditComponent
	},
	{
		path: 'detail',
		component: OrderDetailComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule { }
