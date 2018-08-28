import { Component, ChangeDetectionStrategy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { merge, fromEvent } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { QParamsModel } from '../../_balamir/models/q-models/q-params.model';
import { SelectionModel } from '@angular/cdk/collections';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ProductCategoryEditDialogComponent } from '../product-category-edit-dialog/product-category-edit-dialog.component';
import { LayoutUtilsService, MessageType } from '../../_balamir/utils/layout-utils.service';
import { ProductDataSource } from '../_models/data-sources/product.datasource';
import { ProductModel } from '../_models/product.model';

@Component({
	selector: 'm-product-list',
	templateUrl: './product-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {

	dataSource: ProductDataSource;
	dataResult: ProductModel[] = [];
	displayedColumns = ['select', 'product_number', 'name', 'price', 'status', 'actions'];

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	@ViewChild('searchInput') searchInput: ElementRef;
	filterStatus: number = 0;
	selection = new SelectionModel<ProductModel>(true, []);

	constructor(
		private productService: ProductService,
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

		this.dataSource = new ProductDataSource(this.productService);
		let qParams = new QParamsModel({});


		this.dataSource.loadProducts(qParams);
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

		this.dataSource.loadProducts(qParams);
	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		if (this.filterStatus) {
			filter.status = +this.filterStatus;
		}

		filter.name = searchText;
		filter.product_number = searchText;
		filter.price = searchText;
		filter.code = searchText;

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
		return this.translate.instant('PRODUCT.LIST.STATUS.'+status);
	}

	addData() {
		this.router.navigate(['product/create']);
	}

	editProduct(product: ProductModel) {
		this.router.navigate(['product/edit'], {queryParams: {id: product.id}});
	}

	deleteProduct(product:ProductModel) {
		let _product = product;

		const itemName = `<strong>${_product.name}</strong>`;
		const _title: string = this.translate.instant('BALAMIR.DIALOG.DELETE.TITLE');
		const _desc: string = this.translate.instant('BALAMIR.DIALOG.DELETE.DESC_ITEM', { name: itemName });
		const _waitDesc: string = this.translate.instant('BALAMIR.DIALOG.LOADING.DELETE_ITEM', { name: itemName });
		const _deleteMessage: string = this.translate.instant('BALAMIR.DIALOG.DELETE.SUCCESS_ITEM', { name: itemName });

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _desc, _waitDesc);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			_product.status = -1;

			this.productService.storeProduct(_product).subscribe(res => {
				this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				this.loadData();
			});
		});
	}



	deleteProducts() {
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

			const _products: ProductModel[] = [];
			for (let i = 0; i < this.selection.selected.length; i++) {
				this.selection.selected[i].status = -1;
				_products.push(this.selection.selected[i]);
			}

			this.productService.storeProducts(_products).subscribe(() => {
				this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				this.loadData();
				this.selection.clear();
			});

		});
	}

	fetchProducts() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${elem.name} - ${elem.product_number} - `,
				id: elem.id.toString(),
				status:elem.status
			})
		});

		this.layoutUtilsService.fetchElements(messages);
	}

	updateStatusForProducts() {
		const _title = this.translate.instant('PRODUCT.LIST.STATUS.UPDATE_MESSAGE');
		const _updateMessage = this.translate.instant('PRODUCT.LIST.STATUS.SUCCESS_MESSAGE');
		const _statuses = [
			{ value: 1, text: this.translate.instant('PRODUCT.LIST.STATUS.1') },
			{ value: 9, text: this.translate.instant('PRODUCT.LIST.STATUS.9') }
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

			const _products: ProductModel[] = [];
			for (let i = 0; i < this.selection.selected.length; i++) {
				this.selection.selected[i].status = +res;
				_products.push(this.selection.selected[i]);
			}

			this.productService.storeProducts(_products).subscribe(() => {
				this.layoutUtilsService.showActionNotification(_updateMessage, MessageType.Update);
				this.loadData();
				this.selection.clear();
			});

		});
	}

}
