import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { CustomerService } from '../../../_services/customer.service';

@Component({
	selector: 'm-locations-edit',
	templateUrl: './locations-edit.component.html'
})
export class LocationsEditComponent implements OnInit {
	// Customer Location
	l_type = new FormControl('', Validators.required);
	l_address = new FormControl(null, Validators.required);
	l_country = new FormControl(null);
	l_city = new FormControl(null);
	l_lat = new FormControl(null);
	l_lng = new FormControl(null);
	l_locality = new FormControl(null);
	l_place_id = new FormControl(null);
	l_postal_code = new FormControl(null);
	l_route = new FormControl(null);
	l_street_number = new FormControl(null);

	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

	constructor(
		public dialogRef: MatDialogRef<LocationsEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private customerService: CustomerService
	) {

		if (this.data.isNew) {
			this.l_type.setValue(this.data.locationType.toString());
		} else {
			this.initValues(this.data.updateValues);
		}

	}

	ngOnInit() {
		this.viewLoading = true;
		setTimeout(() => {
			this.viewLoading = false;
		}, 500);
	}

	initValues(values) {
		this.l_type.setValue(values.location_type);
		this.l_address.setValue(values.address);
		this.l_country.setValue(values.country);
		this.l_city.setValue(values.city);
		this.l_lat.setValue(values.lat);
		this.l_lng.setValue(values.lng);
		this.l_locality.setValue(values.locality);
		this.l_place_id.setValue(values.place_id);
		this.l_postal_code.setValue(values.postal_code);
		this.l_route.setValue(values.route);
		this.l_street_number.setValue(values.street_number);
	}

	onNoClick(): void {
		this.dialogRef.close({ isUpdated: false });
	}

	save() {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;

		setTimeout(() => {
			this.viewLoading = false;
			this.closeDialog();
		}, 500);
	}

	closeDialog() {
		this.dialogRef.close({
			isUpdated: true,
			l_type: this.l_type.value,
			l_address: this.l_address.value,
			l_country: this.l_country.value,
			l_city: this.l_city.value,
			l_locality: this.l_locality.value,
			l_lat: this.l_lat.value,
			l_lng: this.l_lng.value,
			l_place_id: this.l_place_id.value,
			l_postal_code: this.l_postal_code.value,
			l_route: this.l_route.value,
			l_street_number: this.l_street_number.value
		});
	}

	initFormPlaces(p) {
		this.l_address.setValue(p.address);
		this.l_country.setValue(p.country);
		this.l_city.setValue(p.city);
		this.l_locality.setValue(p.locality);
		this.l_lat.setValue(p.lat);
		this.l_lng.setValue(p.lng);
		this.l_place_id.setValue(p.place_id);
		this.l_postal_code.setValue(p.postal_code);
		this.l_route.setValue(p.route);
		this.l_street_number.setValue(p.street_number);
	}

	placeChanged(p) {
		this.initFormPlaces(p);
	}

	checkDataIsValid(): boolean {
		return this.l_type.valid && this.l_address.valid;
	}
}