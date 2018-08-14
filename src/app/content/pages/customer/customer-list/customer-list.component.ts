import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CustomerDataSource } from '../_models/data-sources/customer-datasource';
import { MatSort, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { CustomerModel } from '../_models/customer.model';
import { TranslateService } from '@ngx-translate/core';
import { Observable, fromEvent, merge, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { CustomerService } from '../_services/customer.service';
import { QParamsModel } from '../../_balamir/models/q-models/q-params.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutUtilsService, MessageType } from '../../_balamir/utils/layout-utils.service';
import { CustomerGroupModel } from '../_models/customer-group.model';

@Component({
	selector: 'm-customer-list',
	templateUrl: './customer-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerListComponent implements OnInit {
	// TABLO 
	dataSource: CustomerDataSource;
	customerResult: CustomerModel[] = [];
	displayedColumns = ['select', 'customer_number', 'groupName', 'name', 'sur_name', 'business_name', 'phone', 'status', 'actions'];

	// SAYFALAMA
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	// FILTRELEME
	@ViewChild('searchInput') searchInput: ElementRef;
	filterStatus: string = "";
	filterGroup: number = 0;
	selection = new SelectionModel<CustomerModel>(true, []);
	groups: CustomerGroupModel[];

	constructor(
		private translate: TranslateService,
		private customerService: CustomerService,
		private layoutUtilsService: LayoutUtilsService,
		private route: ActivatedRoute,
		private router: Router,
		private cdr: ChangeDetectorRef
	) { }

	ngOnInit() {
		// Tablo dilini başlat
		this.initLang();
		this.loadLists();

		// Tablo Başlangıç sıfırla
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

		merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadCustomerList();
			})
		).subscribe();

		// Arama eventi
		fromEvent(this.searchInput.nativeElement, 'keyup')
			.pipe(
			debounceTime(150),
			distinctUntilChanged(),
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadCustomerList();
			})
			).subscribe();

		// Tablo verileri
		this.dataSource = new CustomerDataSource(this.customerService);
		let qParams = new QParamsModel({});

		// id verisini yakala
		this.route.queryParams.subscribe(params => {
			if (params.id) {
				qParams = this.customerService.lastFilter$.getValue();
				this.restoreState(qParams, +params.id, params.balamir);
			}

			// İlk veriyi çek
			this.dataSource.loadCustomer(qParams);

		});

		// verileri değişkene ata
		this.dataSource.entitySubject.subscribe(res => (this.customerResult = res));

		/* setTimeout(() => {
			this.loadCustomerList();
		}); */
	}

	initLang() {
		this.paginator._intl.itemsPerPageLabel = this.translate.instant('TABLE.PAGINATION.LABEL_PER_PAGE');
		this.paginator._intl.previousPageLabel = this.translate.instant('TABLE.PAGINATION.LABEL_PREV_PAGE');
		this.paginator._intl.nextPageLabel = this.translate.instant('TABLE.PAGINATION.LABEL_NEXT_PAGE');
		this.paginator._intl.firstPageLabel = this.translate.instant('TABLE.PAGINATION.LABEL_FIRST_PAGE');
		this.paginator._intl.lastPageLabel = this.translate.instant('TABLE.PAGINATION.LABEL_LAST_PAGE');
	}

	loadLists() {
		this.customerService.getCustomerGroups().subscribe(res => {
			this.groups = res;
		})
	}

	loadCustomerList() {
		const qParams = new QParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);

		this.dataSource.loadCustomer(qParams);
	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		if (this.filterStatus && this.filterStatus.length > 0) {
			filter.status = +this.filterStatus;
		}

		if (this.filterGroup) {
			filter.group_id = +this.filterGroup;
		}

		filter.name = searchText;
		filter.customer_number = searchText;
		filter.groupName = searchText;
		filter.sur_name = searchText;
		filter.business_name = searchText;
		filter.phone = searchText;

		return filter;
	}

	restoreState(qParams: QParamsModel, id: number, balamirType: string = 'edit') {

		setTimeout(() => {

			if (id > 0) {
				if (balamirType == 'edit') {
					const message = this.translate.instant('BALAMIR.DIALOG.GLOBAL.UPDATE');
					this.layoutUtilsService.showActionNotification(message, MessageType.Update, 10000, true, false);
				} else {
					const message = this.translate.instant('BALAMIR.DIALOG.GLOBAL.CREATE');
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, false);
				}
			}

		}, 500);

		if (!qParams.filter) {
			return;
		}

		if ('status' in qParams.filter) {
			this.filterStatus = qParams.filter.status.toString();
		}

		if ('group_id' in qParams.filter) {
			this.filterGroup = qParams.filter.group_id.toString();
		}

		if (qParams.filter.name) {
			this.searchInput.nativeElement.value = qParams.filter.name;
		}

		if (qParams.filter.customer_number) {
			this.searchInput.nativeElement.value = qParams.filter.customer_number;
		}

	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.customerResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.customerResult.length) {
			this.selection.clear();
		} else {
			this.customerResult.forEach(row => this.selection.select(row));
		}
	}

	getItemCssClassByStatus(status: number = 0): string {
		switch (status) {
			case 0:
				return 'metal';
			case 1:
				return 'success';
			case 9:
				return 'danger';
		}

		return '';
	}

	getItemStatusString(status: number = 0): string {
		switch (status) {
			case 0:
				return this.translate.instant('CUSTOMER.STATUS.PENDING');
			case 1:
				return this.translate.instant('CUSTOMER.STATUS.ACTIVE');
			case 9:
				return this.translate.instant('CUSTOMER.STATUS.SUSPENDED');
		}

		return '';
	}

	addCustomer() {
		this.router.navigate(['customer/create']);
	}

	editCustomer(pid: number) {
		this.router.navigate(['customer/edit'], { queryParams: { id: pid } });
	}

	deleteCustomer(_item: CustomerModel) {
		const itemName = `<strong>${_item.customer_number} - ${_item.name} ${_item.sur_name || ''}</strong>`;
		const _title: string = this.translate.instant('BALAMIR.DIALOG.DELETE.TITLE');
		const _desc: string = this.translate.instant('BALAMIR.DIALOG.DELETE.DESC_ITEM', { name: itemName });
		const _waitDesc: string = this.translate.instant('BALAMIR.DIALOG.LOADING.DELETE_ITEM', { name: itemName });
		const _deleteMessage: string = this.translate.instant('BALAMIR.DIALOG.DELETE.SUCCESS_ITEM', { name: itemName });

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _desc, _waitDesc);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.customerService.delete(_item.id).subscribe(() => {
				this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				this.loadCustomerList();
			});
		});
	}

	deleteCustomers() {
		const count = `<strong>${this.selection.selected.length}</strong>`;
		const _title: string = this.translate.instant('BALAMIR.DIALOG.DELETE.TITLE');
		const _description: string = this.translate.instant('BALAMIR.DIALOG.DELETE.MULTI_DESC_COUNT', { count: count });
		const _waitDesciption: string = this.translate.instant('BALAMIR.DIALOG.LOADING.DELETE_ITEM_MULTI');
		const _deleteMessage = this.translate.instant('BALAMIR.DIALOG.DELETE.SUCCESS_ITEM_MULTI', { count: count });

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			const idsForDeletion: number[] = [];
			for (let i = 0; i < this.selection.selected.length; i++) {
				idsForDeletion.push(this.selection.selected[i].id);
			}

			this.customerService.deleteCustomers(idsForDeletion).subscribe(() => {
				this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				this.loadCustomerList();
				this.selection.clear();
			});

		});
	}

	fetchCustomers() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${elem.customer_number}, ${elem.name} ${elem.sur_name || ''}`,
				id: elem.id.toString(),
				status: elem.status
			})
		});

		this.layoutUtilsService.fetchElements(messages);
	}

	updateStatusForCustomers() {
		const _title = this.translate.instant('CUSTOMER.BALAMIR.STATUS_UPDATE');
		const _updateMessage = this.translate.instant('CUSTOMER.BALAMIR.STATUS_UPDATE_SUCCESS');
		const _statuses = [
			{ value: 0, text: this.translate.instant('CUSTOMER.STATUS.PENDING') },
			{ value: 1, text: this.translate.instant('CUSTOMER.STATUS.ACTIVE') },
			{ value: 9, text: this.translate.instant('CUSTOMER.STATUS.SUSPENDED') }
		];
		const _messages = [];

		this.selection.selected.forEach(elem => {
			_messages.push({
				text: `${elem.name}`,
				id: elem.id.toString(),
				status: elem.status,
				statusTitle: this.getItemStatusString(elem.status),
				statusCssClass: this.getItemCssClassByStatus(elem.status)
			});
		});

		const dialogRef = this.layoutUtilsService.updateStatusForDatas(_title, _statuses, _messages);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				this.selection.clear();
				return;
			}

			this.customerService.updateStatusForCustomer(this.selection.selected, +res).subscribe(() => {
				this.layoutUtilsService.showActionNotification(_updateMessage, MessageType.Update);
				this.loadCustomerList();
				this.selection.clear();
			});
		});
	}

}
