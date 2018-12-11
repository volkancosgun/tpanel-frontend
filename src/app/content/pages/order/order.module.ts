import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderEditComponent } from './order-edit/order-edit.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderRoutingModule } from './order-routing.module';
import { OrderService } from './_services/order.service';
import { SharedModule } from '../../shared/shared.module';
import { CustomerService } from '../customer/_services/customer.service';
import { ProductService } from '../product/_services/product.service';
import { OrderDocPreviewComponent } from './_subs/order-doc-preview/order-doc-preview.component';

@NgModule({
	imports: [
		CommonModule,
		OrderRoutingModule,
		SharedModule,
	],
	declarations: [
		OrderListComponent,
		OrderEditComponent,
		OrderDetailComponent,
		OrderDocPreviewComponent
	],
	entryComponents: [
		OrderDocPreviewComponent
	],
	providers: [
		OrderService,
		CustomerService,
		ProductService
	]
})
export class OrderModule { }
