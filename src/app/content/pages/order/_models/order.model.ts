import { OrderItemModel } from "./order-item.model";

export class OrderModel {
	id: number;
	customer_id: number;
	invoice_number: string;
	order_number: string;
	items: OrderItemModel[];
	status: number;

	clear() {
		this.id = null;
		this.customer_id = null;
		this.invoice_number = null;
		this.order_number = null;
		this.status = 1;
	}
}