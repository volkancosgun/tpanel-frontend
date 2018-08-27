import { Component, ChangeDetectionStrategy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { ProductCategoryModel } from '../_models/product-category.model';
import { ProductCategoryDataSource } from '../_models/data-sources/product-category.datasource';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { merge, fromEvent } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { QParamsModel } from '../../_balamir/models/q-models/q-params.model';
import { SelectionModel } from '@angular/cdk/collections';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ProductCategoryEditDialogComponent } from '../product-category-edit-dialog/product-category-edit-dialog.component';
import { LayoutUtilsService, MessageType } from '../../_balamir/utils/layout-utils.service';

@Component({
	selector: 'm-product-category-list',
	templateUrl: './product-category-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCategoryListComponent implements OnInit {

	headYol: any[] = [];

	dataSource: ProductCategoryDataSource;
	productCategoriesResult: ProductCategoryModel[] = [];
	displayedColumns = ['select', 'id', 'name', 'description', 'status', 'actions'];

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	@ViewChild('searchInput') searchInput: ElementRef;
	filterStatus: number = 0;
	selection = new SelectionModel<ProductCategoryModel>(true, []);

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
				this.loadProductCategoryList();
			})
		).subscribe();

		fromEvent(this.searchInput.nativeElement, 'keyup')
			.pipe(
			debounceTime(150),
			distinctUntilChanged(),
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadProductCategoryList();
			})
			).subscribe();

		this.dataSource = new ProductCategoryDataSource(this.productService);
		let qParams = new QParamsModel({});


		this.dataSource.loadProductCategories(qParams);
		this.dataSource.entitySubject.subscribe(res => (this.productCategoriesResult = res));

	}

	loadProductCategoryList() {
		const qParams = new QParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);

		this.dataSource.loadProductCategories(qParams);
	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		if (this.filterStatus) {
			filter.status = +this.filterStatus;
		}

		filter.name = searchText;
		filter.description = searchText;

		return filter;
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.productCategoriesResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.productCategoriesResult.length) {
			this.selection.clear();
		} else {
			this.productCategoriesResult.forEach(row => this.selection.select(row));
		}
	}

	getItemCssClassByStatus(status: number = 0): string {
		switch (status) {
			case -1:
				return 'metal';
			case 1:
				return 'success';
			case 9:
				return 'metal';
		}

		return '';
	}

	getItemStatusString(status: number = 0): string {
		switch (status) {
			case -1:
				return this.translate.instant('PRODUCT.CATEGORY.STATUS.DELETE');
			case 1:
				return this.translate.instant('PRODUCT.CATEGORY.STATUS.ACTIVE');
			case 9:
				return this.translate.instant('PRODUCT.CATEGORY.STATUS.DISABLE');
		}

		return '';
	}

	goCategory(_id: number) {
		this.headYol.push({
			id: _id
		});

		this.router.navigate(['/product/category/list'], { queryParams: { id: _id } });
	}

	addProductCategory() {
		const newProductCategory = new ProductCategoryModel();
		newProductCategory.clear();
		this.editProductCategory(newProductCategory);
	}

	editProductCategory(category: ProductCategoryModel) {

		const dialogRef = this.dialog.open(ProductCategoryEditDialogComponent, { data: { category } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.storeActionNotification(res);

		})
	}

	deleteProductCategory(category: ProductCategoryModel) {
		let _category = category;
		_category.status = -1;

		const itemName = `<strong>${_category.name}</strong>`;
		const _title: string = this.translate.instant('BALAMIR.DIALOG.DELETE.TITLE');
		const _desc: string = this.translate.instant('BALAMIR.DIALOG.DELETE.DESC_ITEM', { name: itemName });
		const _waitDesc: string = this.translate.instant('BALAMIR.DIALOG.LOADING.DELETE_ITEM', { name: itemName });
		const _deleteMessage: string = this.translate.instant('BALAMIR.DIALOG.DELETE.SUCCESS_ITEM', { name: itemName });

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _desc, _waitDesc);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.productService.storeProductCategory(_category).subscribe(res => {
				this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				this.loadProductCategoryList();
			});
		});
	}

	deleteProductCategories() {
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

			const _categories: ProductCategoryModel[] = [];
			for (let i = 0; i < this.selection.selected.length; i++) {
				this.selection.selected[i].status = -1;
				_categories.push(this.selection.selected[i]);
			}

			this.productService.storeProductCategories(_categories).subscribe(() => {
				this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				this.loadProductCategoryList();
				this.selection.clear();
			});

		});
	}

	fetchCategories() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${elem.name}`,
				id: elem.id.toString(),
				status:elem.status
			})
		});

		this.layoutUtilsService.fetchElements(messages);
	}

	updateStatusForCategories() {
		const _title = this.translate.instant('PRODUCT.CATEGORY.STATUS.UPDATE_MESSAGE');
		const _updateMessage = this.translate.instant('PRODUCT.CATEGORY.STATUS.SUCCESS_MESSAGE');
		const _statuses = [
			{ value: 1, text: this.translate.instant('PRODUCT.CATEGORY.STATUS.ACTIVE') },
			{ value: 9, text: this.translate.instant('PRODUCT.CATEGORY.STATUS.DISABLE') }
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

			const _categories: ProductCategoryModel[] = [];
			for (let i = 0; i < this.selection.selected.length; i++) {
				this.selection.selected[i].status = +res;
				_categories.push(this.selection.selected[i]);
			}

			this.productService.storeProductCategories(_categories).subscribe(() => {
				this.layoutUtilsService.showActionNotification(_updateMessage, MessageType.Update);
				this.loadProductCategoryList();
				this.selection.clear();
			});

		});
	}

	storeActionNotification(res) {
		let _category = res._category;
		let _categoryName = `<strong>${_category.name}</strong>`;
		let saveMessage = 'PRODUCT.CATEGORY.EDIT.';
		saveMessage += res.isEdit ? 'UPDATE_MESSAGE' : 'CREATE_MESSAGE';
		const _saveMessage = this.translate.instant(saveMessage, { name: _categoryName });
		const _messageType = _category.id > 0 ? MessageType.Update : MessageType.Create;

		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 5000, true, false);
		this.loadProductCategoryList();
	}

}
