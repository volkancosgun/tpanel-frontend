import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductBrandModel } from '../_models/product-brand.model';
import { ProductService } from '../_services/product.service';
import { ProductModelModel } from '../_models/product-model.model';
import { MatDialog } from '@angular/material';
import { ProductModelEditDialogComponent } from '../product-model-edit-dialog/product-model-edit-dialog.component';
import { balamir } from '../../../../../environments/balamir';
import { LayoutUtilsService, MessageType } from '../../_balamir/utils/layout-utils.service';
import { TranslateService } from '@ngx-translate/core';
import { SubheaderService } from '../../../../core/services/layout/subheader.service';

@Component({
	selector: 'm-product-model-list',
	templateUrl: './product-model-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductModelListComponent implements OnInit {

	brandId: number = null;
	brand: ProductBrandModel;
	models: ProductModelModel[];
	viewLoading: boolean = false;
	uploadUrl = `${balamir.APP_DOMAIN}`;
	constructor(
		private route: ActivatedRoute,
		private productService: ProductService,
		private router: Router,
		private dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private subHeaderService: SubheaderService,
		private cdr: ChangeDetectorRef
	) { }

	ngOnInit() {

		this.route.queryParams.subscribe(param => {
			this.brandId = param.brand;
			this.initBrand();
		});

		this.subHeaderService.setBreadcrumbs([
			{
				title: 'Ürün Yönetimi',
				page: '/product/list'
			},
			{
				title: 'Markalar',
				page: '/product/brand/list'
			},
			{
				title: `Modeller`,
				page: '/product/model',
				queryParams: {brand: this.brandId}
			}
		])

	}

	initBrand() {
		this.viewLoading = true;
		this.productService.getProductBrandById(this.brandId).subscribe((data: ProductBrandModel) => {
			this.brand = data;
			this.viewLoading = false;
			this.loadModels();
			this.cdr.detectChanges();
		});
	}

	onBack() {
		this.router.navigate(['product/brand/list']);
	}

	createModel() {
		const newProductModel = new ProductModelModel();
		newProductModel.clear();
		this.editModel(newProductModel);

	}

	editModel(model: ProductModelModel) {
		const dialogRef = this.dialog.open(ProductModelEditDialogComponent, { data: { model, brandId: this.brandId } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}



			this.loadModels();
			this.storeActionNotification(res);
			this.cdr.detectChanges();
		});
	}

	deleteModel(model: ProductModelModel) {
		let _model = model;
		_model.status = -1;

		const itemName = `<strong>${_model.name}</strong>`;
		const _title: string = this.translate.instant('BALAMIR.DIALOG.DELETE.TITLE');
		const _desc: string = this.translate.instant('BALAMIR.DIALOG.DELETE.DESC_ITEM', { name: itemName });
		const _waitDesc: string = this.translate.instant('BALAMIR.DIALOG.LOADING.DELETE_ITEM', { name: itemName });
		const _deleteMessage: string = this.translate.instant('BALAMIR.DIALOG.DELETE.SUCCESS_ITEM', { name: itemName });

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _desc, _waitDesc);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.productService.storeProductModel(_model).subscribe(res => {
				this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				this.loadModels();
				this.cdr.detectChanges();
			});

			
		});
	}

	storeActionNotification(res) {
		let _model = res._model;
		let _saveMessage = `<strong>${this.brand.name}</strong> için <strong>${_model.name}</strong> adlı model başarıyla `;
		_saveMessage += res._isEdit ? 'düzenlendi' : 'eklendi';
		const _messageType = _model.id > 0 ? MessageType.Update : MessageType.Create;
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 5000, true, false);
	}

	loadModels() {
		this.viewLoading = true;
		this.productService.getProductModelsByBrand(this.brandId).subscribe((data: ProductModelModel[]) => {
			this.models = data;
			this.viewLoading = false;
			this.cdr.detectChanges();
		});
	}

}
