export class ProductCategoryModel {
	id: number;
	parent_id: number;
	user_id: number;
	name: string;
	description: string;
	status: number;

	clear() {
		this.parent_id = null;
		this.user_id = null;
		this.name = '';
		this.description = null;
		this.status = 1;
	}
}