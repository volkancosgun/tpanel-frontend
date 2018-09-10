import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderEditComponent } from './order-edit/order-edit.component';
import { OrderRoutingModule } from './order-routing.module';
import { OrderService } from './_services/order.service';
import { SharedModule } from '../../shared/shared.module';
import { CustomerService } from '../customer/_services/customer.service';
import { ProductService } from '../product/_services/product.service';

@NgModule({
	imports: [
		CommonModule,
		OrderRoutingModule,
		SharedModule
	],
	declarations: [
		OrderListComponent,
		OrderEditComponent
	],
	providers: [
		OrderService,
		CustomerService,
		ProductService
	]
})
export class OrderModule { }
