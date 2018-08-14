import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../_services/customer.service';
import { CustomerGroupModel } from '../_models/customer-group.model';
import { Observable } from 'rxjs/internal/Observable';
// Material
import { MatPaginator, MatSort, MatDialog, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
// RXJS
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, merge, forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { CustomerGroupDataSource } from '../_models/data-sources/customer-group.datasource';
import { QParamsModel } from '../../_balamir/models/q-models/q-params.model';
import { LayoutUtilsService, MessageType } from '../../_balamir/utils/layout-utils.service';

export interface Element {
	name: string;
	position: number;
	weight: number;
	symbol: string;
}


@Component({
	selector: 'm-customer-groups',
	templateUrl: './customer-groups.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerGroupsComponent implements OnInit {
	// Table fields
	dataSource: CustomerGroupDataSource;
	displayedColumns = ['select', 'id', 'name', 'description', 'status', 'actions'];

	// Sort Paginator
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	// Filter fields
	@ViewChild('searchInput') searchInput: ElementRef;
	filterStatus: string = "";

	// Selection
	selection = new SelectionModel<CustomerGroupModel>(true, []);
	groupsResult: CustomerGroupModel[] = [];

	constructor(
		private customerService: CustomerService,
		private translate: TranslateService,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.initLang();

		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
			tap(() => {
				this.loadGroupsList();
			})
			)
			.subscribe();

		// Filtration
		fromEvent(this.searchInput.nativeElement, 'keyup')
			.pipe(
			debounceTime(150),
			distinctUntilChanged(),
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadGroupsList();
			})
			)
			.subscribe();

		// Init DataSource
		//let queryParams = new QParamsModel(this.filterConfiguration(false));
		this.dataSource = new CustomerGroupDataSource(this.customerService);
		let queryParams = new QParamsModel({});

		this.route.queryParams.subscribe(params => {
			if (params.id) {
				queryParams = this.customerService.lastFilter$.getValue();
				this.restoreState(queryParams, +params.id, params.balamir);
			}

			// First load
			this.dataSource.loadGroups(queryParams);
		});

		this.dataSource.entitySubject.subscribe(res => (this.groupsResult = res));
	}

	initLang() {
		this.paginator._intl.itemsPerPageLabel = this.translate.instant('TABLE.PAGINATION.LABEL_PER_PAGE');
		this.paginator._intl.previousPageLabel = this.translate.instant('TABLE.PAGINATION.LABEL_PREV_PAGE');
		this.paginator._intl.nextPageLabel = this.translate.instant('TABLE.PAGINATION.LABEL_NEXT_PAGE');
		this.paginator._intl.firstPageLabel = this.translate.instant('TABLE.PAGINATION.LABEL_FIRST_PAGE');
		this.paginator._intl.lastPageLabel = this.translate.instant('TABLE.PAGINATION.LABEL_LAST_PAGE');
	}

	restoreState(queryParams: QParamsModel, id: number, balamirType: string = 'edit') {

		setTimeout(() => {
			if (id > 0) {
				if (balamirType == 'edit') {
					const message = this.translate.instant('BALAMIR.DIALOG.GLOBAL.UPDATE');
					this.layoutUtilsService.showActionNotification(message, MessageType.Update, 10000, true, false);
				} else {
					const message = this.translate.instant('BALAMIR.DIALOG.GLOBAL.CREATE');
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, false);
				}
				/* this.customerService.groupGetById(id).subscribe((res: CustomerGroupModel) => {
					const message = res.created_at === res.updated_at ?
						`Yeni grup başarıyla eklendi.` :
						`Değişiklikler başarıyla kaydedildi.`;
					this.layoutUtilsService.showActionNotification(message, res._isNew ? MessageType.Create : MessageType.Update, 10000, true, false);
				}); */
			}
		}, 500);

		if (!queryParams.filter) {
			return;
		}

		if ('status' in queryParams.filter) {
			this.filterStatus = queryParams.filter.status.toString();
		}

		if (queryParams.filter.name) {
			this.searchInput.nativeElement.value = queryParams.filter.name;
		}
	}

	loadGroupsList() {
		const queryParams = new QParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		this.dataSource.loadGroups(queryParams);
		//this.selection.clear();
	}

	/** Group Add */
	addGroup() {
		this.router.navigate(['customer/group/create']);
	}

	editGroup(pid: number) {
		this.router.navigate(['customer/group/edit'], { queryParams: { id: pid } });
	}

	/** FILTRATION */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		if (this.filterStatus && this.filterStatus.length > 0) {
			filter.status = +this.filterStatus;
		}

		filter.description = searchText;
		filter.name = searchText;
		return filter;
	}

	/** Selection */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.groupsResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.groupsResult.length) {
			this.selection.clear();
		} else {
			this.groupsResult.forEach(row => this.selection.select(row));
		}
	}

	/** Update */
	updateStatusForGroups() {
		const _title = this.translate.instant('CUSTOMER.GROUPS.STATUS_UPDATE');
		const _updateMessage = this.translate.instant('CUSTOMER.GROUPS.STATUS_UPDATE_SUCCESS');
		const _statuses = [
			{ value: 1, text: this.translate.instant('BALAMIR.STATUS.ACTIVE') },
			{ value: 9, text: this.translate.instant('BALAMIR.STATUS.DISABLE') }
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

			this.customerService.updateStatusForGroup(this.selection.selected, +res).subscribe(() => {
				this.layoutUtilsService.showActionNotification(_updateMessage, MessageType.Update);
				this.loadGroupsList();
				this.selection.clear();
			});
		});



	}

	/** Fetch */
	fetchGroups() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${elem.name}, ${elem.description}`,
				id: elem.id.toString(),
				status: elem.status
			})
		});

		this.layoutUtilsService.fetchElements(messages);
	}

	/** Delete Single */
	deleteGroup(_item: CustomerGroupModel) {
		const itemName = `<strong>${_item.name}</strong>`;
		const _title: string = this.translate.instant('BALAMIR.DIALOG.DELETE.TITLE');
		const _desc: string = this.translate.instant('BALAMIR.DIALOG.DELETE.DESC_ITEM', { name: itemName });
		const _waitDesc: string = this.translate.instant('BALAMIR.DIALOG.LOADING.DELETE_ITEM', { name: itemName });
		const _deleteMessage: string = this.translate.instant('BALAMIR.DIALOG.DELETE.SUCCESS_ITEM', { name: itemName });

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _desc, _waitDesc);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.customerService.groupDelete(_item.id).subscribe(() => {
				this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				this.loadGroupsList();
			});
		})
	}

	/** Delete Groups (multiple) */
	deleteGroups() {
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

			this.customerService.deleteCustomerGroups(idsForDeletion).subscribe(() => {
				this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				this.loadGroupsList();
				this.selection.clear();
			});

			//console.log(idsForDeletion);

		});

	}

	getItemCssClassByStatus(status: number = 0): string {
		switch (status) {
			case 1:
				return 'success';
			case 9:
				return '';
		}

		return '';
	}

	getItemStatusString(status: number = 0): string {
		switch (status) {
			case 1:
				return this.translate.instant('BALAMIR.STATUS.ACTIVE');
			case 9:
				return this.translate.instant('BALAMIR.STATUS.DISABLE');
		}

		return '';
	}

}
