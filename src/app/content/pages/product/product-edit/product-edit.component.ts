import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges } from '@angular/core';
import { ProductModel } from '../_models/product.model';
import { Observable, forkJoin } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../_services/product.service';
import { TranslateService } from '@ngx-translate/core';
import { ProductCategoryModel } from '../_models/product-category.model';
import { QParamsModel } from '../../_balamir/models/q-models/q-params.model';
import { QResultsModel } from '../../_balamir/models/q-models/q-results.model';
import { LayoutUtilsService, MessageType } from '../../_balamir/utils/layout-utils.service';
import { TypesUtilsService } from '../../_balamir/utils/types-utils.service';
import { ProductBrandModel } from '../_models/product-brand.model';
import { ProductModelModel } from '../_models/product-model.model';
import { ProductTaxModel } from '../_models/product-tax.model';

@Component({
	selector: 'm-product-edit',
	templateUrl: './product-edit.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductEditComponent implements OnInit {
	product: ProductModel;
	oldProduct: ProductModel;
	loadingSubject = new BehaviorSubject<boolean>(false);
	loading$ = this.loadingSubject.asObservable();
	dataForm: FormGroup;
	hasFormErrors: boolean = false;
	selectedTab: number = 0;

	categories: ProductCategoryModel[];
	qParams: QParamsModel;
	qResults: QResultsModel;

	brands: ProductBrandModel[];
	models: ProductModelModel[];
	taxes: ProductTaxModel[];

	constructor(
		private translate: TranslateService,
		private route: ActivatedRoute,
		private router: Router,
		private productService: ProductService,
		private fb: FormBuilder,
		private layoutUtilsService: LayoutUtilsService,
		private typesUtilsService: TypesUtilsService,
		private cdr: ChangeDetectorRef
	) { }

	ngOnInit() {

		this.loadingSubject.next(true);

		this.route.queryParams.subscribe(params => {
			const id = +params.id;

			if (id && id > 0) {
				this.productService.getProductById(id).subscribe(res => {
					this.product = res;
				

					this.oldProduct = Object.assign({}, res);
					this.initProduct();
					this.loadModels(res.brand_id);

				});
			} else {
				const newData = new ProductModel();
				newData.clear();

				this.product = newData;
				this.oldProduct = Object.assign({}, newData);
				this.initProduct();
			}

		});
	}

	onChanges() {
		this.dataForm.get('brand_id').valueChanges.subscribe(value => {
			this.loadModels(value);
		});	
	}

	getTitle(): string {
		let result = this.translate.instant('PRODUCT.MENU.CREATE');
		if (!this.product || !this.product.id) {
			return result;
		}

		let itemName = `${this.product.name}`;

		result = this.translate.instant('PRODUCT.MENU.EDIT_ITEM', { name: itemName });

		return result;

	}

	reset() {
		this.product = Object.assign({}, this.oldProduct);
		this.createForm();
		this.hasFormErrors = false;
		this.dataForm.markAsPristine();
		this.dataForm.markAsUntouched();
		this.dataForm.updateValueAndValidity();
	}

	initProduct() {
		this.loadCats();
		this.loadBrands();
		this.loadTaxes();
		this.createForm();
		this.onChanges();

	}

	loadCats() {

		this.productService.getProductCats().subscribe(data => {
			this.categories = data;
			this.loadingSubject.next(false);
			this.cdr.detectChanges();
		});
	}

	loadBrands() {
		this.productService.getProductBrands().subscribe(data => {
			this.brands = data;
			this.loadingSubject.next(false);
			this.cdr.detectChanges();
		});
	}

	loadTaxes() {
		this.productService.getProductTaxes().subscribe(data => {
			this.taxes = data;
			this.loadingSubject.next(false);
			this.cdr.detectChanges();
		});
	}

	loadModels(brandId: number) {
		this.loadingSubject.next(true);
		this.productService.getProductModelsByBrand(brandId).subscribe(data => {
			this.models = data;
			this.loadingSubject.next(false);
			this.cdr.detectChanges();
		});
	}

	createForm() {

		this.dataForm = this.fb.group({
			code: [this.product.code, [Validators.required]],
			category_id: [this.product.category_id, [Validators.required]],
			brand_id: [this.product.brand_id],
			model_id: [this.product.model_id],
			tax_id: [this.product.tax_id],
			name: [this.product.name, [Validators.required]],
			_search: [this.product._search],
			description: [this.product.description],
			exp: [this.product.expiration_at, [Validators.nullValidator]],
			n_weight: [this.product.n_weight],
			g_weight: [this.product.g_weight],
			purchase_price: [this.product.purchase_price],
			deposit_fee: [this.product.deposit_fee],
			carton_total: [this.product.carton_total],
			carton_price: [this.product.carton_price],
			carton_barcode: [this.product.carton_barcode],
			palette_total: [this.product.palette_total],
			palette_price: [this.product.palette_price],
			palette_barcode: [this.product.palette_barcode],
			container_total: [this.product.container_total],
			container_price: [this.product.container_price],
			container_barcode: [this.product.container_barcode],
			price: [this.product.price, [Validators.required]],
			status: [this.product.status, [Validators.required]]
		});

	}

	onSubmit(wBack: boolean = false, newForm: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.dataForm.controls;

		if (this.dataForm.invalid) {
			Object.keys(controls).forEach(controlName => {
				controls[controlName].markAsTouched();
			});

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;

		}

		let storeProduct = this.prepareProduct();
		this.storeProduct(storeProduct, wBack, newForm);

	}

	prepareProduct(): ProductModel {
		const controls = this.dataForm.controls;
		const _product = new ProductModel();

		_product.id = this.product.id;
		_product.product_number = this.product.product_number;
		_product.code = controls['code'].value;
		_product.category_id = controls['category_id'].value;
		_product.brand_id = controls['brand_id'].value;
		_product.model_id = controls['model_id'].value;
		_product.tax_id = controls['tax_id'].value;
		_product.name = controls['name'].value;
		_product._search = controls['_search'].value;
		_product.description = controls['description'].value;
		_product.expiration_at = controls['exp'].value;
		_product.n_weight = controls['n_weight'].value;
		_product.g_weight = controls['g_weight'].value;
		_product.purchase_price = controls['purchase_price'].value;
		_product.deposit_fee = controls['deposit_fee'].value;
		_product.carton_total = controls['carton_total'].value;
		_product.carton_price = controls['carton_price'].value;
		_product.carton_barcode = controls['carton_barcode'].value;
		_product.palette_total = controls['palette_total'].value;
		_product.palette_price = controls['palette_price'].value;
		_product.palette_barcode = controls['palette_barcode'].value;
		_product.container_total = controls['container_total'].value;
		_product.container_price = controls['container_price'].value;
		_product.container_barcode = controls['container_barcode'].value;
		_product.price = controls['price'].value;
		_product.status = controls['status'].value;
		return _product;
	}

	storeProduct(_product: ProductModel, wBack: boolean = false, newForm: boolean = false) {

		this.loadingSubject.next(true);
		this.productService.storeProduct(_product).subscribe((res: ProductModel) => {
			this.loadingSubject.next(false);

			let itemName = `<strong>${res.product_number} - ${res.name}</strong>`;
			let message = 'PRODUCT.EDIT.';
			let _isEdited: boolean = false;
			if (!_product.id) {
				message += 'CREATE_MESSAGE';
			} else {
				message += 'UPDATE_MESSAGE';
				_isEdited = true;
			}

			let _message = this.translate.instant(message, { name: itemName });
			this.layoutUtilsService.showActionNotification(_message, _product.id ? MessageType.Create : MessageType.Update, 5000, true, false);


			this.balamirOk(res, _isEdited, wBack, newForm);

		});
	}

	balamirOk(_product: ProductModel, _isEdited: boolean, wBack: boolean, newForm: boolean) {

		if (wBack) {
			this.pageBack(_product.id, _isEdited);
			return;
		}

		if (newForm) {
			this.pageNewForm(_product.product_number);
		}

	}

	pageNewForm(product_number: string = 'none') {
		this.router.navigate(['product/create'], { queryParams: { balamirRef: product_number } });
	}

	pageBack(id?: number, isEdit: boolean = false) {
		let _backUrl = 'product/list';

		if (this.product.id || id) {
			_backUrl += '?id=' + this.product.id + '&balamir=' + isEdit;
		}

		this.router.navigateByUrl(_backUrl);
	}

}
