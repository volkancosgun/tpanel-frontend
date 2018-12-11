import { Component, ChangeDetectionStrategy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OrderService } from '../_services/order.service';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { merge, fromEvent } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { QParamsModel } from '../../_balamir/models/q-models/q-params.model';
import { SelectionModel } from '@angular/cdk/collections';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { LayoutUtilsService, MessageType } from '../../_balamir/utils/layout-utils.service';
import { OrderDataSource } from '../_models/data-sources/order.datasource';
import { OrderModel } from '../_models/order.model';

@Component({
	selector: 'm-order-list',
	templateUrl: './order-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderListComponent implements OnInit {

	dataSource: OrderDataSource;
	dataResult: OrderModel[] = [];
	displayedColumns = ['select', 'order_number', 'customer_name', 'price', 'tax_price', 'total_price', 'status', 'actions'];

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	@ViewChild('searchInput') searchInput: ElementRef;
	filterStatus: number = 0;
	selection = new SelectionModel<OrderModel>(true, []);

	constructor(
		private orderService: OrderService,
		private translate: TranslateService,
		private router: Router,
		private dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService
	) { }

	ngOnInit() {

		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

		merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadData();
			})
		).subscribe();

		fromEvent(this.searchInput.nativeElement, 'keyup')
			.pipe(
			debounceTime(150),
			distinctUntilChanged(),
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadData();
			})
			).subscribe();

		this.dataSource = new OrderDataSource(this.orderService);
		let qParams = new QParamsModel({});


		this.dataSource.loadOrders(qParams);
		this.dataSource.entitySubject.subscribe(res => (this.dataResult = res));

	}

	loadData() {
		const qParams = new QParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);

		this.dataSource.loadOrders(qParams);
	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		if (this.filterStatus) {
			filter.status = +this.filterStatus;
		}

		filter.name = searchText;
		filter.order_number = searchText;
		filter.customer_name = searchText;

		return filter;
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.dataResult.length) {
			this.selection.clear();
		} else {
			this.dataResult.forEach(row => this.selection.select(row));
		}
	}

	getItemCssClassByStatus(status: number = 0): string {
		switch (status) {
			case 1:
				return 'success';
			case 9:
				return 'metal';
		}

		return 'danger';
	}

	getItemStatusString(status: number = 0): string {
		return this.translate.instant('ORDER.LIST.STATUS.' + status);
	}

	addData() {
		this.router.navigate(['order/create']);
	}

	editOrder(order: OrderModel) {
		this.router.navigate(['order/edit'], { queryParams: { id: order.id } });
	}

	deleteOrder(order: OrderModel) {
		console.log(order);
	}

	detailOrder(order: OrderModel) {
		this.router.navigate(['order/detail'], { queryParams: { id: order.id } });
	}



	deleteOrders() {

	}

	fetchOrders() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${elem.order_number}`,
				id: elem.id.toString(),
				status: elem.status
			})
		});

		this.layoutUtilsService.fetchElements(messages);
	}

	updateStatusForOrders() {

	}

	invoiceOrder(order: OrderModel) {


		const loader = this.layoutUtilsService.showLoader();

		this.orderService.createInvoiceOrder(order.id).subscribe((res: any) => {
			loader.close();
			if (res.error) {
				this.layoutUtilsService.alertDialog(null, res.msg);
				return false;
			}

			this.layoutUtilsService.showActionNotification('Fatura başarıyla oluşturuldu.', MessageType.Create);

		});

	}

}
