import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material';

import { CustomerGroupModel } from '../_models/customer-group.model';
import { Observable, forkJoin, from, of, BehaviorSubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from '../../../../core/services/layout/subheader.service';
import { TypesUtilsService } from '../../_balamir/utils/types-utils.service';
import { CustomerService } from '../_services/customer.service';
import { LayoutUtilsService, MessageType } from '../../_balamir/utils/layout-utils.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'm-customer-group-edit',
	templateUrl: './customer-group-edit.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerGroupEditComponent implements OnInit {

	group: CustomerGroupModel;
	oldGroup: CustomerGroupModel;
	selectedTab: number = 0;
	loadingSubject = new BehaviorSubject<boolean>(false);
	loading$ = this.loadingSubject.asObservable();
	groupForm: FormGroup;
	hasFormErrors: boolean = false;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private groupFB: FormBuilder,
		private subheaderService: SubheaderService,
		private customerService: CustomerService,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private cdr: ChangeDetectorRef
	) { }

	ngOnInit() {
		this.loadingSubject.next(true);
		this.activatedRoute.queryParams.subscribe(params => {
			const id = +params.id;
			if (id && id > 0) {
				// init group
				this.customerService.groupGetById(id).subscribe(res => {
					this.group = res;
					this.oldGroup = Object.assign({}, res);
					this.initGroup();
					this.cdr.detectChanges();
				})
			} else {
				const newGroup = new CustomerGroupModel();
				newGroup.clear();
				this.group = newGroup;
				this.oldGroup = Object.assign({}, newGroup);
				this.initGroup();
			}
		})

	}

	initGroup() {
		this.createForm();
		this.loadingSubject.next(false);

		if (!this.group.id) {
			this.subheaderService.setBreadcrumbs([
				{ title: this.translate.instant('CUSTOMER.MENU.CUSTOMERS'), page: '/customer' },
				{ title: this.translate.instant('CUSTOMER.MENU.GROUPS'), page: '/customer/groups' },
				{ title: this.translate.instant('CUSTOMER.MENU.GROUPS_CREATE'), page: '/customer/group/create' }
			]);
			return;
		}
		this.subheaderService.setTitle('Grup Düzenle');
		this.subheaderService.setBreadcrumbs([
			{ title: this.translate.instant('CUSTOMER.MENU.CUSTOMERS'), page: '/customer' },
			{ title: this.translate.instant('CUSTOMER.MENU.GROUPS'), page: '/customer/groups' },
			{ title: this.translate.instant('CUSTOMER.GROUPS.GROUP_EDIT_ITEM', {name: this.group.name}), page: '/customer/group/edit', queryParams: { id: this.group.id } }
		]);
	}

	createForm() {
		this.groupForm = this.groupFB.group({
			name: [this.group.name, Validators.required],
			description: [this.group.description],
			status: [this.group.status, Validators.required]
		});
	}

	getComponentTitle() {
		let result = this.translate.instant('CUSTOMER.MENU.GROUPS_CREATE');
		if (!this.group || !this.group.id) {
			return result;
		}

		result = this.translate.instant('CUSTOMER.GROUPS.GROUP_EDIT_ITEM', {name: this.group.name});
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	goBack(id = 0, type: string = 'edit') {
		let _backUrl = 'customer/groups';
		if (id > 0) {
			_backUrl += '?id=' + id + '&balamir=' + type;
		}

		this.router.navigateByUrl(_backUrl);
	}

	goList() {
		this.router.navigate(['customer/groups']);
	}

	goAdd() {
		this.reset();
		const _refreshUrl = 'customer/group/create?balamir=newForm';
		this.router.navigateByUrl(_refreshUrl);
	}

	refreshGroup(id = 0) {
		const _refreshUrl = 'customer/group/edit?id=' + id;
		this.router.navigateByUrl(_refreshUrl);
	}

	reset() {
		this.group = Object.assign({}, this.oldGroup);
		this.createForm();
		this.hasFormErrors = false;
		this.groupForm.markAsPristine();
		this.groupForm.markAsUntouched();
		this.groupForm.updateValueAndValidity();
	}

	onSubmit(withBack: boolean = false, newForm: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.groupForm.controls;

		if (this.groupForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		let editedGroup = this.prepareGroup();

		if (editedGroup.id > 0) {
			this.updateGroup(editedGroup, withBack, newForm);
			return;
		}

		this.addGroup(editedGroup, withBack, newForm);
	}

	prepareGroup(): CustomerGroupModel {
		const controls = this.groupForm.controls;
		const _group = new CustomerGroupModel();
		_group.id = this.group.id;
		_group.name = controls['name'].value;
		_group.description = controls['description'].value;
		_group.status = controls['status'].value;
		return _group;
	}

	addGroup(_group: CustomerGroupModel, wBack: boolean = false, newForm: boolean = false) {
		this.loadingSubject.next(true);
		this.customerService.groupCreate(_group).subscribe(res => {
			this.loadingSubject.next(false);
			if (wBack) {
				this.goBack(res.id, 'add');
			} else {
				let itemName = `<strong>${_group.name}</strong>`;
				const message = this.translate.instant('CUSTOMER.GROUPS.CREATE_ITEM', { name: itemName });
				this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, false);

				if (newForm) {
					this.goAdd();
				} else {
					this.refreshGroup(res.id);
				}
			}
		})
	}

	updateGroup(_group: CustomerGroupModel, wBack: boolean = false, newForm: boolean = false) {
		this.loadingSubject.next(true);

		let tasks$ = [this.customerService.updateStatusGroup(_group)];

		// Update digerleri
		/* this.remarksListState.addedItems.forEach(element => {
			tasks$.push(this.remarksService.createRemark(element));
		}); */

		forkJoin(tasks$).subscribe(res => {
			this.loadingSubject.next(false);
			if (wBack) {
				this.goBack(_group.id, 'edit');
			} else {
				let itemName = `<strong>${_group.name}</strong>`;
				const message = this.translate.instant('CUSTOMER.GROUPS.UPDATE_ITEM', { name: itemName });
				this.layoutUtilsService.showActionNotification(message, MessageType.Update, 10000, true, false);

				if (newForm) {
					this.goAdd();
				} else {
					this.refreshGroup(_group.id);
				}
			}
		})
	}

}
