import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CustomerModel } from '../../customer/_models/customer.model';
import { CustomerService } from '../../customer/_services/customer.service';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { OrderModel } from '../_models/order.model';
import { CustomerLocationsModel } from '../../customer/_models/customer-locations.model';
import { TranslateService } from '@ngx-translate/core';
import { OrderItemModel } from '../_models/order-item.model';
import { ProductModel } from '../../product/_models/product.model';
import { ProductService } from '../../product/_services/product.service';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import { OrderService } from '../_services/order.service';
import { BehaviorSubject } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../_balamir/utils/layout-utils.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductTaxModel } from '../../product/_models/product-tax.model';

@Component({
	selector: 'm-order-edit',
	templateUrl: './order-edit.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderEditComponent implements OnInit, AfterViewInit {
	order: OrderModel;
	oldOrder: OrderModel;
	orderItems: FormArray;
	orderForm: FormGroup;
	orderFormErrors: boolean = false;
	orderTotalNetto: number = 0.00;
	orderTotalPrice: number = 0.00;
	orderTotalTax: number = 0.00;

	customers: CustomerModel[] = [];
	customerLoading: boolean = false;

	customerAdr: CustomerLocationsModel[] = [];
	customerAdrLoading: boolean = false;
	customerAdrValue: CustomerLocationsModel = new CustomerLocationsModel();

	products: ProductModel[] = [];
	taxes: ProductTaxModel[] = [];
	productLoading: boolean = false;

	Math: any;

	viewLoading: boolean = false;

	afterLoading: boolean = false;

	constructor(
		private customerService: CustomerService,
		private orderService: OrderService,
		private productService: ProductService,
		private fb: FormBuilder,
		private translate: TranslateService,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef
	) {
		this.Math = Math;


	}

	get orderItemsData() { return <FormArray>this.orderForm.get('orderItems'); }

	ngAfterViewInit() {
		this.afterLoading = true;
	}

	ngOnInit() {
		this.viewLoading = true;
		this.route.queryParams.subscribe(params => {
			const order_id = +params.id;

			if (order_id && order_id > 0) {

				this.orderService.getOrderById(order_id).subscribe((res: OrderModel) => {
					this.order = res;
					this.oldOrder = Object.assign({}, res);

					this.initOrder();
					
					this.loadOrderItems();
					this.removeOrderItem(0);

					
					this.orderForm.get('customer_id').setValue(res.customer_id, { emitEvent: true });

					


				});

			} else {
				const newOrder = new OrderModel();
				newOrder.clear();

				this.order = newOrder;
				this.oldOrder = Object.assign({}, newOrder);
				this.initOrder();
			}

		});

	}

	initOrder() {

		this.loadCustomer();
		this.loadProducts();
		this.loadTaxes();
		this.formCreate();
		this.onChanges();

	}

	onChanges(): void {
		this.orderForm.get('customer_id').valueChanges.subscribe(val => {
			if (val) {
				this.loadLocations(val);
			}
		});

		this.orderForm.get('customer_location_id').valueChanges.subscribe(val => {
			if (val) {
				this.onAdrChange(val);
			}
		});


		this.orderForm.get('orderItems').valueChanges.debounceTime(1000).subscribe(values => {

			this.orderTotalNetto = 0;
			this.orderTotalPrice = 0;
			this.orderTotalTax = 0;
			const ctrl = this.orderForm.get('orderItems') as FormArray;

			ctrl.controls.forEach((x: FormArray) => {

				const productId = x.get('product_id').value;

				if (!productId) {
					this.resetCalculateItem(x);
					return;
				}

				let unit = x.get('unit').value;
				let inputPrice = x.get('price').value;

				let productPrice = this.products.find(x => x.id == productId).price;
				let taxId = this.products.find(x => x.id == productId).tax_id;
				let taxValue = this.taxes.find(x => x.id == taxId).tax;

				x.get('tax').setValue(taxValue, { emitEvent: false });

				switch (unit) {
					case 'CARTON':
						productPrice = this.products.find(x => x.id == productId).carton_price;
						break;
					case 'PALETTE':
						productPrice = this.products.find(x => x.id == productId).palette_price;
						break;
					case 'CONTAINER':
						productPrice = this.products.find(x => x.id == productId).container_price;
						break;
					default:
						productPrice = this.products.find(x => x.id == productId).price;
						break;
				}

				if (!inputPrice || productPrice != inputPrice) {
					x.get('price').setValue(+productPrice, { emitEvent: false });
				}

				this.onCalculateItem(x);



			});
		})
	}

	checkUnit(productId, unitType) {

		let _findProduct = productId ? this.products.find(x => x.id == productId) : null;
		let _price = null;

		switch (unitType) {
			case 'CARTON':
				_price = _findProduct ? _findProduct.carton_price : null;
				break;

			case 'PALETTE':
				_price = _findProduct ? _findProduct.palette_price : null;
				break;

			case 'CONTAINER':
				_price = _findProduct ? _findProduct.container_price : null;
				break;
		}

		if (+_price > 0) {
			return false;
		}

		return true;

	}

	resetCalculateItem(x: FormArray) {
		x.reset({}, { emitEvent: false });
		x.get('amount').setValue(1);
		x.get('unit').setValue('DEFAULT');
	}

	onCalculateItem(x: FormArray) {

		let price = x.get('price').value;

		let amount = x.get('amount').value;

		price = amount * price;

		let tax = x.get('tax').value;

		let totalPrice = x.get('total_price').value;

		let taxResult = (price * tax) / 100;

		let totalResult = price + taxResult;

		this.orderTotalNetto += price;

		this.orderTotalTax += taxResult;

		this.orderTotalPrice += parseFloat(totalResult);

		x.get('total_price').setValue(totalResult, { emitEvent: false });

		this.cdr.detectChanges();

	}

	onAdrChange(location_id) {
		let _location = this.customerAdr.find((item: CustomerLocationsModel) => item.id === location_id);
		this.customerAdrValue = _location;
		this.orderForm.patchValue({ bill_address: this.customerAdrValue.address });
	}

	loadCustomer() {
		this.viewLoading = true;
		this.customerLoading = true;
		this.customerService.list().subscribe(data => {
			this.customers = data;
			this.customerLoading = false;
			this.viewLoading = false;
			this.cdr.detectChanges();
		});
	}

	loadProducts() {
		this.productLoading = true;
		this.productService.list().subscribe(data => {
			this.products = data;
			this.productLoading = false;

			this.cdr.detectChanges();
		})
	}

	loadTaxes() {
		this.productService.getProductTaxes().subscribe(data => {
			this.taxes = data;
		});
	}

	loadOrderItems() {
		this.orderItems = this.orderForm.get('orderItems') as FormArray;
		this.orderService.getOrderItems(this.order.id).subscribe((data: OrderItemModel[]) => {
			data.forEach(item => {
				this.orderItems.push(this.initOrderItem(item));
			});
		});
	}

	initOrderItem(data: OrderItemModel): FormGroup {
		return this.fb.group({
			product_id: data.product_id,
			amount: data.amount,
			unit: data.unit,
			unit_price: data.price,
			price: data.price,
			tax: data.tax,
			total_price: data.total_price

		});
	}

	loadLocations(customer_id: number) {

		if (!this.order.id) {

			this.orderForm.patchValue({ customer_location_id: null, bill_address: null });
		}

		this.customerAdrLoading = true;
		this.viewLoading = true;
		this.customerService.findLocationByCustomerId(customer_id).subscribe((data: CustomerLocationsModel[]) => {
			
			if (!data.length) {
				this.orderForm.patchValue({ customer_location_id: null, bill_address: null });
			}

			this.customerAdr = data;
			this.customerAdrLoading = false;
			this.viewLoading = false;
			this.cdr.detectChanges();
		});
	}

	getLangLocationType(location_type): string {

		return this.translate.instant(`CUSTOMER.LOCATION.TYPES.${location_type}`);
	}

	customerSearch(term: string, item: CustomerModel) {
		term = term.toLocaleLowerCase();

		item.customer_number = item.customer_number || '';
		item.name = item.name || '';
		item._search = item._search || '';

		return item.customer_number.toLocaleLowerCase().indexOf(term) > -1 || item.name.toLocaleLowerCase().indexOf(term) > -1 || item._search.toLocaleLowerCase().indexOf(term) > -1;
	}

	customerAdrSearch() {
		return;
	}

	productSearch(term: string, item: ProductModel) {
		term = term.toLocaleLowerCase();
		item.name = item.name || '';

		return item.name.toLocaleLowerCase().indexOf(term) > -1;
	}

	formCreate() {

		this.orderForm = this.fb.group({
			customer_id: [this.order.customer_id, [Validators.required]],
			customer_location_id: [this.order.location_id, [Validators.required]],
			bill_address: [this.order.bill_address, [Validators.required]],
			orderItems: this.fb.array([this.createOrderItem()])
		});
	}

	onSubmit(wBack: boolean = false, newForm: boolean = false) {
		this.orderFormErrors = false;
		const controls = this.orderForm.controls;

		if (this.orderForm.invalid) {
			Object.keys(controls).forEach(controlName => {
				controls[controlName].markAsTouched();
			});

			this.orderFormErrors = true;
			return;

		}

		let storeOrder = this.prepareOrder();
		this.storeOrder(storeOrder, wBack, newForm);
	}


	prepareOrder(): OrderModel {

		const controls = this.orderForm.controls;
		const _order = new OrderModel();

		_order.id = this.order.id;
		_order.customer_id = controls['customer_id'].value;
		_order.location_id = controls['customer_location_id'].value;
		_order.bill_address = controls['bill_address'].value;
		_order.price = this.orderTotalNetto;
		_order.tax_price = this.orderTotalTax;
		_order.total_price = this.orderTotalPrice;
		_order.items = controls['orderItems'].value;
		_order.status = 1;

		return _order;
	}

	storeOrder(_order: OrderModel, wBack: boolean = false, newForm: boolean = false) {


		this.viewLoading = true;
		this.orderService.storeOrder(_order).subscribe((res: OrderModel) => {
			this.viewLoading = false;

			let itemName = `<strong>${res.order_number}</strong>`;
			let _isEdited: boolean = false;
			let message = 'ORDER.EDIT.';
			if (!_order.id) {
				message += 'CREATE_MESSAGE';
			} else {
				message += 'UPDATE_MESSAGE';
				_isEdited = true;
			}

			let _message = this.translate.instant(message, { name: itemName });
			this.layoutUtilsService.showActionNotification(_message, _order.id ? MessageType.Create : MessageType.Update, 5000, true, false);


			this.balamirOk(res, _isEdited, wBack, newForm);

			this.cdr.detectChanges();

		});
	}

	balamirOk(_order: OrderModel, _isEdited: boolean, wBack: boolean, newForm: boolean) {

		if (wBack) {
			this.pageBack(_order.id, _isEdited);
			return;
		}

		if (newForm) {
			this.pageNewForm(_order.order_number);
		}

	}

	pageNewForm(order_number: string = 'none') {
		this.router.navigate(['order/create'], { queryParams: { balamirRef: order_number } });
	}

	pageBack(id?: number, isEdit: boolean = false) {
		let _backUrl = 'order/list';

		if (this.order.id || id) {
			_backUrl += '?id=' + this.order.id + '&balamir=' + isEdit;
		}

		this.router.navigateByUrl(_backUrl);
	}

	getTitle(): String {

		let message = '';

		if (!this.order || !this.order.id) {
			message += `Sipariş Oluştur`;
		} else {
			message += `${this.order.order_number} numaralı siparişi düzenle`;
		}

		return message;
	}

	reset() {
		this.order = Object.assign({}, this.oldOrder);
		this.formCreate();
		this.orderFormErrors = false;
		this.orderForm.markAsPristine();
		this.orderForm.markAsUntouched();
		this.orderForm.updateValueAndValidity();
	}

	createOrderItem(): FormGroup {
		return this.fb.group({
			product_id: null,
			amount: 1,
			unit: 'DEFAULT',
			unit_price: 0,
			price: 0,
			tax: 0,
			total_price: 0

		});
	}

	addOrderItem(): void {
		this.orderItems = this.orderForm.get('orderItems') as FormArray;
		this.orderItems.push(this.createOrderItem());

	}

	removeOrderItem(index): void {
		this.orderItems.removeAt(index);
	}

	onAlertClose($event) {
		this.orderFormErrors = false;
	}

}
