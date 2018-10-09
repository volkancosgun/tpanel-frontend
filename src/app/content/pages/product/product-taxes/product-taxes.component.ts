import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ProductTaxModel } from '../_models/product-tax.model';
import { ProductService } from '../_services/product.service';
import { MatDialog } from '@angular/material';
import { ProductTaxesEditDialogComponent } from '../product-taxes-edit-dialog/product-taxes-edit-dialog.component';
import { LayoutUtilsService, MessageType } from '../../_balamir/utils/layout-utils.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'm-product-taxes',
	templateUrl: './product-taxes.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductTaxesComponent implements OnInit {

	taxes: ProductTaxModel[];

	viewLoading: boolean = true;
	loadingAfterSubmit: boolean = false;
	constructor(
		private productService: ProductService,
		private dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private cdr: ChangeDetectorRef
	) { }

	ngOnInit() {

		this.loadTaxes();
	}

	loadTaxes() {
		this.viewLoading = true;
		this.productService.getProductTaxes().subscribe((data: ProductTaxModel[]) => {
			this.taxes = data;
			this.viewLoading = false;
			this.cdr.detectChanges();
		});
	}

	createTax() {
		const newProductTax = new ProductTaxModel();
		newProductTax.clear();

		this.editTax(newProductTax);
	}

	editTax(tax: ProductTaxModel) {
		const dialogRef = this.dialog.open(ProductTaxesEditDialogComponent, { data: { tax } });
		dialogRef.afterClosed().subscribe(res => {

			if (!res) {
				return;
			}

			this.storeActionNotification(res);
			this.loadTaxes();
			this.cdr.detectChanges();

		});
	}

	deleteTax(tax: ProductTaxModel) {
		let _model = tax;
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

			this.productService.storeProductTax(_model).subscribe(res => {
				this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				this.loadTaxes();
				this.cdr.detectChanges();
			});

			
		});
	}

	storeActionNotification(res) {
		let _tax = res._tax;
		let _saveMessage = `<strong>${_tax.name}</strong> adlı vergi oranı <strong>% ${_tax.tax}</strong> olarak `;
		_saveMessage += res._isEdit ? 'düzenlendi' : 'eklendi';
		const _messageType = _tax.id > 0 ? MessageType.Update : MessageType.Create;
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 5000, true, false);
	}

}
