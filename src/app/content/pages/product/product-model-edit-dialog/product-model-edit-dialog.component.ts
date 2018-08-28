import { Component, OnInit, Inject } from '@angular/core';
import { ProductModelModel } from '../_models/product-model.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProductService } from '../_services/product.service';

@Component({
	selector: 'm-product-model-edit-dialog',
	templateUrl: './product-model-edit-dialog.component.html',
	styleUrls: ['./product-model-edit-dialog.component.scss']
})
export class ProductModelEditDialogComponent implements OnInit {

	model: ProductModelModel;
	modelForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;

	constructor(
		public dialogref: MatDialogRef<ProductModelEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private productService: ProductService,
	) { }

	ngOnInit() {

		this.model = this.data.model;
		this.createForm();

	}

	getTitle(): String {
		let _title = 'Model';

		if (this.model.id > 0) {
			_title += ' Düzenle';
		} else {
			_title += ' Ekle';
		}

		return _title;

	}

	createForm() {
		this.modelForm = this.fb.group({
			name: [this.model.name, [Validators.required]],
			status: [this.model.status, [Validators.required]]
		});
	}

	prepareModel(): ProductModelModel {
		const controls = this.modelForm.controls;
		const _model = new ProductModelModel();
		_model.id = this.model.id;
		_model.brand_id = this.data.brandId;
		_model.name = controls['name'].value;
		_model.status = controls['status'].value;

		return _model;
	}

	onCancel(): void {
		this.dialogref.close();
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	onSubmit() {
		this.hasFormErrors = false;
		this.loadingAfterSubmit = false;
		const controls = this.modelForm.controls;

		if (this.modelForm.invalid) {
			Object.keys(controls).forEach(controlName => {
				controls[controlName].markAsTouched();
			});

			this.hasFormErrors = true;

			return;
		}

		const editedModel = this.prepareModel();
		this.storeModel(editedModel);
	}

	storeModel(_model: ProductModelModel) {
		this.viewLoading = true;
		this.productService.storeProductModel(_model).subscribe(res => {
			this.viewLoading = false;
			this.dialogref.close({
				_model,
				_isEdit: _model.id ? true : false
			});
		});
	}

}
