import { BaseModel } from "../../_balamir/models/_base.model";

export class CustomerGroupModel extends BaseModel {
	id: number;
	user_id: number;
	name: string;
	description: string;
	status: number;

	clear() {
		this.name = '';
		this.description = '';
		this.status = 1;
	}

 }