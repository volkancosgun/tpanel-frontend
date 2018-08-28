import { Component, OnInit, Inject } from '@angular/core';
import { ProductCategoryModel } from '../_models/product-category.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProductService } from '../_services/product.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'm-product-category-edit-dialog',
	templateUrl: './product-category-edit-dialog.component.html',
})
export class ProductCategoryEditDialogComponent implements OnInit {
	category: ProductCategoryModel;
	categoryForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	constructor(
		public dialogRef: MatDialogRef<ProductCategoryEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private productService: ProductService,
		private translate: TranslateService
	) { }

	ngOnInit() {
		this.category = this.data.category;
		this.createForm();

		this.viewLoading = true;
		setTimeout(() => {
			this.viewLoading = false;
		}, 500);
	}

	getTitle(): String {
		let _productEditTitle = 'PRODUCT.CATEGORY.';
		if (this.category.id > 0) {
			_productEditTitle += 'ISEDIT';
		} else {
			_productEditTitle += 'CREATE';
		}
		
		return this.translate.instant(_productEditTitle, {name: this.category.name});
	}

	createForm() {
		this.categoryForm = this.fb.group({
			name: [this.category.name, Validators.required],
			description: [this.category.description],
			status: [this.category.status]
		});
	}

	prepareCategory(): ProductCategoryModel {
		const controls = this.categoryForm.controls;
		const _category = new ProductCategoryModel();
		_category.id = this.category.id;
		_category.name = controls['name'].value;
		_category.description = controls['description'].value;
		_category.status = controls['status'].value;
		return _category;
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onSubmit() {

		this.hasFormErrors = false;
		this.loadingAfterSubmit = false;
		const controls = this.categoryForm.controls;

		if (this.categoryForm.invalid) {
			Object.keys(controls).forEach(controlName => 
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}


		const editedCategory = this.prepareCategory();
		if (editedCategory.id > 0) {
			this.updateCategory(editedCategory);
		} else {
			this.createCategory(editedCategory);
		}
	}

	createCategory(_category: ProductCategoryModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;

		this.storeCategory(_category);
	} 

	updateCategory(_category: ProductCategoryModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;

		this.storeCategory(_category, true);
	} 

	storeCategory(_category: ProductCategoryModel, _isEdit: boolean = false) {
		this.viewLoading = true;
		this.productService.storeProductCategory(_category).subscribe(res => {
			this.viewLoading = false;
			this.dialogRef.close({
				_category,
				isEdit: _isEdit
			});
		});
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

}
