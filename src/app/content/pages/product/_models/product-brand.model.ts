export class ProductBrandModel {
	id: number;
	name: string;
	logo: string;
	status: number;

	clear() {
		this.name = null;
		this.logo = null;
		this.status = 1;
	}
}