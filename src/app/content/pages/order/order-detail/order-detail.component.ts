import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { OrderService } from '../_services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderModel } from '../_models/order.model';
import { LayoutUtilsService, MessageType } from '../../_balamir/utils/layout-utils.service';
import { OrderItemModel } from '../_models/order-item.model';
import { TranslateService } from '@ngx-translate/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import { AlertComponent } from '../../_balamir/shared/alert/alert.component';
import { OrderDocPreviewComponent } from '../_subs/order-doc-preview/order-doc-preview.component';
import { balamir } from '../../../../../environments/balamir';

@Component({
	selector: 'm-order-detail',
	templateUrl: './order-detail.component.html',
	styleUrls: ['./order-detail.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailComponent implements OnInit {

	orderId: number;
	order: OrderModel;

	orderItems: OrderItemModel[];

	orders: OrderModel[] = [];
	orderLoading: boolean = false;
	orderSelected: number = null;

	pdfUrl: string;

	constructor(
		private orderService: OrderService,
		private route: ActivatedRoute,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private cdr: ChangeDetectorRef,
		private translate: TranslateService,
		private matBottomSheet: MatBottomSheet
	) { }

	ngOnInit() {

		this.route.queryParams.subscribe(param => {
			this.orderId = param.id;
		});

		this.loadOrders();

		if (this.orderId) {
			setTimeout(() => {
				this.onLoad();
			}, 500);
		}

	}


	onLoad() {

		let loader = this.layoutUtilsService.showLoader();

		this.orderService.getOrderById(this.orderId).subscribe((res: OrderModel) => {
			loader.close();
			this.order = res;
			this.orderSelected = res.id;
			this.pdfUrl = `${balamir.APP_DOMAIN}/uploads/invoices/${this.order.sevdesk_doc_id}.pdf`;

			this.cdr.detectChanges();
		});

	}

	loadOrders() {

		this.orderLoading = true;
		this.orderService.getOrderList().subscribe((res: OrderModel[]) => {
			this.orders = res;
			this.orderLoading = false;
			this.cdr.detectChanges();
		});

	}

	orderSearch(term: string, item: OrderModel) {
		term = term.toLocaleLowerCase();

		item.order_number = item.order_number || '';

		return item.order_number.toLocaleLowerCase().indexOf(term) > -1;
	}

	orderDetail() {

		this.orderId = this.orderSelected;


		if (this.orderId) {
			this.onLoad();
		}

	}

	getUnitLang(unit: string): String {

		return this.translate.instant(`PRODUCT.UNIT.${unit}`);
	}

	invoiceOrder() {

		if (this.order.sevdesk_order_id) {
			this.invoiceShow();
		} else {
			this.invoiceCreate();
		}

	}

	invoiceShow() {
		this.matBottomSheet.open(OrderDocPreviewComponent, { data: this.order });
	}

	invoiceCreate() {
		const loader = this.layoutUtilsService.showLoader();

		this.orderService.createInvoiceOrder(this.order.id).subscribe((res: any) => {
			loader.close();
			if (res.error) {
				this.layoutUtilsService.alertDialog(null, res.msg);
				return false;
			}

			this.onLoad();
			this.layoutUtilsService.showActionNotification('Fatura başarıyla oluşturuldu.', MessageType.Create);

		});
	}

	pageBack() : void {
		this.router.navigate(['order/list']);
	}

}
