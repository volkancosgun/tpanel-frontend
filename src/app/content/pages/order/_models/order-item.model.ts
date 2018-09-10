export class OrderItemModel {
	id: number;
	order_id: number;
	product_id: number;
	name: string;
	amount: number;
	unit: string;
	price: number;
	tax: number;
	total_price: number;
	status: number;

	clear() {
		this.id = null;
		this.order_id = null;
		this.product_id = null;
		this.name = null;
		this.amount = 1;
		this.unit = null;
		this.price = null;
		this.tax = null;
		this.total_price = null;
		this.status = 1;
	}
}