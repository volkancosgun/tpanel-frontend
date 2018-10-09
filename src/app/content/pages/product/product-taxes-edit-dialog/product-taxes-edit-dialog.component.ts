import { Component, OnInit, Inject } from '@angular/core';
import { ProductTaxModel } from '../_models/product-tax.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProductService } from '../_services/product.service';

@Component({
	selector: 'm-product-taxes-edit-dialog',
	templateUrl: './product-taxes-edit-dialog.component.html',
	styleUrls: ['./product-taxes-edit-dialog.component.scss']
})
export class ProductTaxesEditDialogComponent implements OnInit {

	tax: ProductTaxModel;
	taxForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

	constructor(
		public dialogRef: MatDialogRef<ProductTaxesEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private productService: ProductService,
	) { }

	ngOnInit() {

		this.tax = this.data.tax;

		this.createForm();

	}

	getTitle(): String {
		let _title = 'Vergi Oranı';

		if (this.tax.id > 0) {
			_title += ' Düzenle';
		} else {
			_title += ' Ekle';
		}

		return _title;

	}

	createForm() {
		this.taxForm = this.fb.group({
			name: [this.tax.name],
			tax: [this.tax.tax, [Validators.required]],
			status: [this.tax.status, [Validators.required]]
		});
	}

	prepareTax(): ProductTaxModel {
		const _controls = this.taxForm.controls;
		const _tax = new ProductTaxModel();

		_tax.id = this.tax.id;
		_tax.name = _controls['name'].value;
		_tax.tax = _controls['tax'].value;
		_tax.status = _controls['status'].value;

		return _tax;
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onSubmit() {
		this.hasFormErrors = false;
		this.loadingAfterSubmit = false;
		const controls = this.taxForm.controls;

		if (this.taxForm.invalid) {
			Object.keys(controls).forEach(controlName => {
				controls[controlName].markAsTouched();
			});

			this.hasFormErrors = true;

			return;
		}

		const editedTax = this.prepareTax();
		this.store(editedTax);
	}

	store(_tax: ProductTaxModel) {
		this.viewLoading = true;
		this.productService.storeProductTax(_tax).subscribe(res => {
			this.viewLoading = false;
			this.dialogRef.close({
				_tax,
				_isEdit: _tax.id ? true : false
			});
		});
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

}
