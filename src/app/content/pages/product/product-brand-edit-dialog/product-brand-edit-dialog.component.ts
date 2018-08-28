import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { ProductBrandModel } from '../_models/product-brand.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProductService } from '../_services/product.service';
import { balamir } from '../../../../../environments/balamir';

@Component({
	selector: 'm-product-brand-edit-dialog',
	templateUrl: './product-brand-edit-dialog.component.html',
	styleUrls: ['./product-brand-edit-dialog.component.scss']
})
export class ProductBrandEditDialogComponent implements OnInit {
	brand: ProductBrandModel;
	brandForm: FormGroup;
	hasFormErorrs: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	logo: string = '../assets/app/media/img/logos/nopicture.jpg';
	constructor(
		public dialogRef: MatDialogRef<ProductBrandEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private productService: ProductService,
		private cd: ChangeDetectorRef
	) { }

	ngOnInit() {
		this.brand = this.data.brand;
		this.createForm();

		if (this.brand.logo) {
			this.logo = `${balamir.APP_DOMAIN}${this.brand.logo}`;
		}

		this.viewLoading = true;
		setTimeout(() => {
			this.viewLoading = false;
		}, 500);
	}

	getTitle(): String {
		let _title = 'Marka';

		if (this.brand.id > 0) {
			_title += ' Düzenle';
		} else {
			_title += ' Ekle';
		}

		return _title;

	}

	createForm() {
		this.brandForm = this.fb.group({
			name: [this.brand.name, [Validators.required]],
			logo: [null],
			status: [this.brand.status, [Validators.required]]
		});
	}

	prepareBrand(): ProductBrandModel {
		const controls = this.brandForm.controls;
		const _brand = new ProductBrandModel();
		_brand.id = this.brand.id;
		_brand.name = controls['name'].value;
		_brand.logo = controls['logo'].value;
		_brand.status = controls['status'].value;

		return _brand;
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onAlertClose($event) {
		this.hasFormErorrs = false;
	}

	onLogoChange(event) {
		const reader = new FileReader();

		if (event.target.files && event.target.files.length) {
			const [file] = event.target.files;
			reader.readAsDataURL(file);

			reader.onload = () => {
				this.brandForm.patchValue({
					logo: reader.result.split(',')[1]
				});

				this.logo = reader.result;
			}

			this.cd.markForCheck();
		}
	}

	onSubmit() {
		this.hasFormErorrs = false;
		this.loadingAfterSubmit = false;
		const controls = this.brandForm.controls;

		if (this.brandForm.invalid) {
			Object.keys(controls).forEach(controlName => {
				controls[controlName].markAsTouched();
			});

			this.hasFormErorrs = true;

			return;
		}

		const editedBrand = this.prepareBrand();
		this.storeBrand(editedBrand);

	}

	storeBrand(_brand: ProductBrandModel) {
		this.viewLoading = true;
		this.productService.storeProductBrand(_brand).subscribe(res => {
			this.viewLoading = false;
			this.dialogRef.close({
				_brand,
				_isEdit: _brand.id ? true : false
			});
		})

	}

}
