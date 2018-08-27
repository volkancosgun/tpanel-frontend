import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductCategoryListComponent } from './product-category-list/product-category-list.component';
import { AuthGuard } from '../auth/_guards/auth.guard';
import { ProductEditComponent } from './product-edit/product-edit.component';

const routes: Routes = [
	{
		path: '',
		component: ProductListComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'list',
		component: ProductListComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'create',
		component: ProductEditComponent
	},
	{
		path: 'edit',
		component: ProductEditComponent
	},
	{
		path: 'category/list',
		component: ProductCategoryListComponent,
		canActivate: [AuthGuard]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ProductRoutingModule { }