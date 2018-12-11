import { OrderItemModel } from "./order-item.model";

export class OrderModel {
	id: number;
	customer_id: number;
	location_id: number;
	bill_address: string;
	bill_number: string;
	delivered_date: string;
	order_number: string;
	sevdesk_order_id: number;
	sevdesk_doc_id: string;
	sevdesk_doc_pdf: string;
	price: number;
	tax_price: number;
	total_price: number;
	items: OrderItemModel[];
	status: number;

	clear() {
		//this.id = null;
		this.customer_id = null;
		this.location_id = null;
		this.bill_number = null;
		this.order_number = null;
		this.sevdesk_order_id = null;
		this.bill_address = null;
		this.delivered_date = null;
		this.price = null;
		this.tax_price = null;
		this.total_price = null;
		this.status = 1;
	}
}