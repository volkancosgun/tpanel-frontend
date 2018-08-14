import { BaseModel } from "../../_balamir/models/_base.model";

export class CustomerLocationsModel extends BaseModel {
	id: number;
	customer_id: number;
	location_type: string;
	description: string;
	address: string;
	city: string;
	country: string;
	lat: number;
	lng: number;
	locality: string;
	place_id: string;
	postal_code: string;
	route: string;
	street_number: string;
	status: number;

	clear(customer_id: number = undefined) {
		this.id = undefined;
		this.customer_id = customer_id;
		this.location_type = '';
		this.description = '';
		this.address = '';
		this.city = '';
		this.country = '';
		this.lat = undefined;
		this.lng = undefined;
		this.locality = '';
		this.place_id = '';
		this.postal_code = '';
		this.route = '';
		this.street_number = '';
		this.status = 1;
	}
}