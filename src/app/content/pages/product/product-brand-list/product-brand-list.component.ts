import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ProductBrandModel } from '../_models/product-brand.model';
import { ProductService } from '../_services/product.service';
import { ProductBrandEditDialogComponent } from '../product-brand-edit-dialog/product-brand-edit-dialog.component';
import { MatDialog } from '@angular/material';
import { balamir } from '../../../../../environments/balamir';
import { LayoutUtilsService, MessageType } from '../../_balamir/utils/layout-utils.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
	selector: 'm-product-brand-list',
	templateUrl: './product-brand-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductBrandListComponent implements OnInit {

	brands: ProductBrandModel[];
	viewLoading: boolean = true;
	viewLock: boolean = false;
	uploadUrl = `${balamir.APP_DOMAIN}`;
	constructor(
		private productService: ProductService,
		private dialog: MatDialog,
		private cdr: ChangeDetectorRef,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private router: Router
	) { }

	ngOnInit() {

		this.loadBrands();

	}

	loadBrands() {
		this.viewLoading = true;
		this.productService.getProductBrands().subscribe((data: ProductBrandModel[]) => {
			this.brands = data;
			this.viewLoading = false;
			this.cdr.detectChanges();
		});
	}

	createBrand() {
		const newProductBrand = new ProductBrandModel();
		newProductBrand.clear();
		this.editBrand(newProductBrand);

	}

	editBrand(brand: ProductBrandModel) {
		const dialogRef = this.dialog.open(ProductBrandEditDialogComponent, { data: { brand } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}



			this.loadBrands();
			this.storeActionNotification(res);
			this.cdr.detectChanges();
		});
	}

	deleteBrand(brand: ProductBrandModel) {
		let _brand = brand;
		_brand.status = -1;
		_brand.logo = null;

		const itemName = `<strong>${_brand.name}</strong>`;
		const _title: string = this.translate.instant('BALAMIR.DIALOG.DELETE.TITLE');
		const _desc: string = this.translate.instant('BALAMIR.DIALOG.DELETE.DESC_ITEM', { name: itemName });
		const _waitDesc: string = this.translate.instant('BALAMIR.DIALOG.LOADING.DELETE_ITEM', { name: itemName });
		const _deleteMessage: string = this.translate.instant('BALAMIR.DIALOG.DELETE.SUCCESS_ITEM', { name: itemName });

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _desc, _waitDesc);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.productService.storeProductBrand(_brand).subscribe(res => {
				this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				this.loadBrands();
				this.cdr.detectChanges();
			});

			
		});
	}

	goModelPage(brand: ProductBrandModel) {

		this.router.navigate(['product/model'], { queryParams: { brand: brand.id } });

	}

	storeActionNotification(res) {
		let _brand = res._brand;
		let _saveMessage = `<strong>${_brand.name}</strong> adlı marka başarıyla `;
		_saveMessage += res._isEdit ? 'düzenlendi' : 'eklendi';
		const _messageType = _brand.id > 0 ? MessageType.Update : MessageType.Create;
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 5000, true, false);
	}

}
