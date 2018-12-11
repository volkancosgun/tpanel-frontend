import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockStoreEditComponent } from './stock-store-edit/stock-store-edit.component';
import { StockStoreListComponent } from './stock-store-list/stock-store-list.component';

const routes: Routes = [
	{
		path: '',
		component: StockStoreListComponent
	},
	{
		path: 'store/create',
		component: StockStoreEditComponent
	},
	{
		path: 'store/list',
		component: StockStoreListComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class StockRoutingModule { }