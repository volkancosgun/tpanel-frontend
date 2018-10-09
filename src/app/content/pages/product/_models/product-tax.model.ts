export class ProductTaxModel {
	id: number;
	name: string;
	tax: number;
	status: number;

	clear() {
		this.name = null;
		this.tax = null;
		this.status = 1;
	}
}