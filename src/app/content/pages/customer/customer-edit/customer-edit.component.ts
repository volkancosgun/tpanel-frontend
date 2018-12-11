import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
// Material
import { MatDialog } from '@angular/material';
import { CustomerModel } from '../_models/customer.model';
import { Observable, forkJoin } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../_services/customer.service';
import { TranslateService } from '@ngx-translate/core';
import { SubheaderService } from '../../../../core/services/layout/subheader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerGroupModel } from '../_models/customer-group.model';
import { phonecodes } from '../../../../../environments/phonecodes';
import { CustomerLocationsModel } from '../_models/customer-locations.model';
import { ListStateModel, StateActions } from '../../_balamir/utils/list-state.model';
import { LayoutUtilsService, MessageType } from '../../_balamir/utils/layout-utils.service';
import { LocationsEditComponent } from '../_subs/locations/locations-edit/locations-edit.component';

import { MatTableDataSource } from '@angular/material';
import { MenuConfigService } from '../../../../core/services/menu-config.service';
import { SettingsService } from '../../settings/_services/settings.service';

@Component({
	selector: 'm-customer-edit',
	templateUrl: './customer-edit.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerEditComponent implements OnInit {

	customer: CustomerModel;
	oldCustomer: CustomerModel;
	loadingSubject = new BehaviorSubject<boolean>(false);
	loading$ = this.loadingSubject.asObservable();
	customerForm: FormGroup;
	hasFormErrors: boolean = false;
	selectedTab: number = 0;
	groups: CustomerGroupModel[];
	locations: ListStateModel;
	locationss: any = [];
	phoneCodes = phonecodes;

	displayedColumns = ['l_type', 'l_address'];
	dataSource = new MatTableDataSource();
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private customerService: CustomerService,
		private settingsService: SettingsService,
		private subheaderService: SubheaderService,
		private translate: TranslateService,
		private customerFB: FormBuilder,
		private layoutUtilsService: LayoutUtilsService,
		private dialog: MatDialog,
		private cdr: ChangeDetectorRef,
	) { }

	ngOnInit() {

		this.loadingSubject.next(true);

		this.activatedRoute.queryParams.subscribe(params => {
			// Müşteri Idsi
			const id = +params.id;
			if (id && id > 0) {
				// Eğer müşteri Idsi varsa
				this.customerService.customerGetById(id).subscribe(res => {
					this.customer = res;

					this.oldCustomer = Object.assign({}, res);
					this.initCustomer();
					//this.cdr.detectChanges();
				});
			} else {
				// Eğer yeni bir müşteri kaydıysa
				const newCustomer = new CustomerModel();
				// Formu sıfırla
				newCustomer.clear();

				this.customer = newCustomer;
				this.oldCustomer = Object.assign({}, newCustomer);
				this.initCustomer();
			}
		});

	}

	initCustomer() {

		// Form Oluştur
		this.createForm();

		// Loading kapat
		this.loadingSubject.next(false);

		if (!this.customer.id) {
			this.subheaderService.setBreadcrumbs([
				{ title: this.translate.instant('CUSTOMER.MENU.CUSTOMERS'), page: '/customer/list' },
				{ title: this.translate.instant('CUSTOMER.MENU.CREATE'), page: '/customer/create' }
			]);
			return;
		}

		this.subheaderService.setTitle('Müşteri düzenle');
		this.subheaderService.setBreadcrumbs([
			{ title: this.translate.instant('CUSTOMER.MENU.CUSTOMERS'), page: '/customer/list' },
			{ title: this.translate.instant('CUSTOMER.MENU.EDIT_ITEM', { name: this.customer.name, sur_name: this.customer.sur_name || '' }), page: '/customer/create', queryParams: { id: this.customer.id } },
		]);
	}

	createForm() {

		this.customerForm = this.customerFB.group({
			gender: [this.customer.gender.toString(), Validators.required],
			_search: [this.customer._search],
			group_id: [this.customer.group_id, Validators.required],
			business_name: [this.customer.business_name],
			business_manager: [this.customer.business_manager],
			name: [this.customer.name, Validators.required],
			sur_name: [this.customer.sur_name],
			email: [this.customer.email, [Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
			phone: [this.customer.phone],
			phone_code: [this.customer.phone_code],
			phone_mobil: [this.customer.phone_mobil],
			phone_mobil_code: [this.customer.phone_mobil_code],
			fax: [this.customer.fax],
			fax_code: [this.customer.fax_code],
			description: [this.customer.description],
			iban: [this.customer.iban],
			bic: [this.customer.bic],
			sepa: [this.customer.sepa],
			tax_number: [this.customer.tax_number],
			tax: [this.customer.tax],
			status: [this.customer.status.toString()]
		});

		this.cdr.detectChanges();

		this.customerService.getCustomerGroups().subscribe(res => {
			this.groups = res;
		});

	}

	getComponentTitle() {
		let result = this.translate.instant('CUSTOMER.MENU.CREATE');
		if (!this.customer || !this.customer.id) {
			return result;
		}

		result = this.translate.instant('CUSTOMER.MENU.EDIT_ITEM', { name: this.customer.name, sur_name: this.customer.sur_name || '' })
		return result;
	}

	goBack(id = 0, type: string = 'edit') {
		let _backUrl = 'customer/list';

		if (id > 0) {
			_backUrl += '?id=' + id + '&balamir=' + type;
		}

		this.router.navigateByUrl(_backUrl);
	}

	goAdd() {
		this.reset();
		const _refreshUrl = 'customer/create?balamir=newForm';
		this.router.navigateByUrl(_refreshUrl);
	}

	refreshCustomer(id = 0) {
		const _refreshUrl = 'customer/edit?id=' + id;
		this.router.navigateByUrl(_refreshUrl);
	}

	reset() {
		this.customer = Object.assign({}, this.oldCustomer);
		this.createForm();
		this.hasFormErrors = false;
		this.customerForm.markAsPristine();
		this.customerForm.markAsUntouched();
		this.customerForm.updateValueAndValidity();
	}

	onSubmit(wBack: boolean = false, newForm: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.customerForm.controls;

		// Eğer gerekli alanlar doldurulmadıysa
		if (this.customerForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		let editedCustomer = this.prepareCustomer();

		if (editedCustomer.id > 0) {
			this.updateCustomer(editedCustomer, wBack, newForm);
			return;
		}

		this.addCustomer(editedCustomer, wBack, newForm);

	}

	prepareCustomer(): CustomerModel {

		const controls = this.customerForm.controls;
		const _customer = new CustomerModel();
		_customer.id = this.customer.id;
		_customer.gender = controls['gender'].value;
		_customer._search = controls['_search'].value;
		_customer.group_id = controls['group_id'].value;
		_customer.business_name = controls['business_name'].value;
		_customer.business_manager = controls['business_manager'].value;
		_customer.name = controls['name'].value;
		_customer.sur_name = controls['sur_name'].value;
		_customer.email = controls['email'].value;
		_customer.phone_code = controls['phone_code'].value;
		_customer.phone = controls['phone'].value;
		_customer.phone_mobil = controls['phone_mobil'].value;
		_customer.phone_mobil_code = controls['phone_mobil_code'].value;
		_customer.fax = controls['fax'].value;
		_customer.fax_code = controls['fax_code'].value;
		_customer.description = controls['description'].value;
		_customer.iban = controls['iban'].value;
		_customer.bic = controls['bic'].value;
		_customer.sepa = controls['sepa'].value;
		_customer.tax_number = controls['tax_number'].value;
		_customer.tax = controls['tax'].value;
		_customer.status = controls['status'].value;
		_customer.__locations = this.locationss;
		return _customer;
	}

	updateCustomer(_customer: CustomerModel, wBack: boolean = false, newForm: boolean = false) {
		this.loadingSubject.next(true);

		let tasks$ = [this.customerService.edit(_customer)];

		forkJoin(tasks$).subscribe(res => {
			this.loadingSubject.next(false);
			if (wBack) {
				this.goBack(_customer.id, 'edit');
			} else {
				let itemName = `<strong>${_customer.name}</strong>`;
				const message = this.translate.instant('CUSTOMER.BALAMIR.UPDATE_ITEM', { name: itemName });
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 10000, true, false);

				if (newForm) {
					this.goAdd();
				} else {
					this.refreshCustomer(_customer.id);
				}
			}
		});
	}

	addCustomer(_customer: CustomerModel, wBack: boolean = false, newForm: boolean = false) {
		this.loadingSubject.next(true);
		this.customerService.customerCreate(_customer).subscribe(res => {

			if (res.id) {
				this.settingsService.sevdeskTransferById(res.id).subscribe((res: any) => {
					console.log(res);
				});
			}

			this.loadingSubject.next(false);
			if (wBack) {
				this.goBack(res.id, 'create');
			} else {
				let itemName = `<strong>${_customer.name} ${_customer.sur_name || ''}</strong>`;
				const message = this.translate.instant('CUSTOMER.BALAMIR.CREATE_ITEM', { name: itemName });
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, false);
				if (newForm) {
					this.goAdd();
				} else {
					this.refreshCustomer(res.id);
				}
			}


		});
	}

	addLocation() {
		let newLocation = new CustomerLocationsModel();
		newLocation.clear();
		const dialogRef = this.dialog.open(LocationsEditComponent, {
			data: {
				locationType: 'BUSINESS',
				isNew: true,
			},
			width: '680px'
		});

		dialogRef.afterClosed().subscribe(res => {
			if (res) {
				this.locationss.push(res);
				this.prepareCustomer();
				this.dataSource.data = this.locationss;
				//console.log(this.dataSource);
			}

			//this.customer.__locations.push(res);
			let customerData = this.prepareCustomer();
			console.log(customerData);
		});
	}


}
