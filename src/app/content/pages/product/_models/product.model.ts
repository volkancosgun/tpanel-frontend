export class ProductModel {
	id: number;
	user_id: number;
	code: string;
	category_id: number;
	brand_id: number;
	product_number: string;
	name: string;
	description: string;
	expiration_at: Date;
	n_weight: number;
	g_weight: number;
	deposit_fee: number;
	purchase_price: number;
	carton_total: number;
	carton_price: number;
	carton_barcode: string;
	palette_total: number;
	palette_price: number;
	palette_barcode: string;
	container_total: number;
	container_price: number;
	container_barcode: string;
	price: number;
	status: number;
	exp: Date;

	clear() {
		this.code = null;
		this.category_id = null;
		this.brand_id = null;
		this.product_number = null;
		this.name = null;
		this.description = null;
		this.exp = new Date();
		this.expiration_at = new Date();
		this.n_weight = null;
		this.g_weight = null;
		this.deposit_fee = null;
		this.purchase_price = null;
		this.carton_total = null;
		this.carton_price = null;
		this.carton_barcode = null;
		this.palette_total = null;
		this.palette_price = null;
		this.palette_barcode = null;
		this.container_total = null;
		this.container_price = null;
		this.container_barcode = null;
		this.price = null;
		this.status = 1;

	}

}