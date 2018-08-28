export class ProductModelModel {
	id: number;
	brand_id: number;
	name: string;
	status: number;

	clear() {
		this.brand_id = null;
		this.name = null;
		this.status = 1;
	}
}