import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { OrderModel } from '../../_models/order.model';
import { balamir } from '../../../../../../environments/balamir';
import { OrderService } from '../../_services/order.service';

@Component({
	selector: 'm-order-doc-preview',
	templateUrl: './order-doc-preview.component.html',
	styleUrls: ['./order-doc-preview.component.scss']
})
export class OrderDocPreviewComponent implements OnInit {

	order: OrderModel;
	imageUrl: string;
	pdfUrl: string;
	constructor(
		private bottomSheetRef: MatBottomSheetRef<OrderDocPreviewComponent>,
		@Inject(MAT_BOTTOM_SHEET_DATA) public data: any
	) {
		this.order = data;
		this.imageUrl = `${balamir.APP_DOMAIN}/uploads/invoices/${this.order.sevdesk_doc_id}.jpg`;
		//this.pdfUrl = this.order.sevdesk_doc_pdf;
		this.pdfUrl = `${balamir.APP_DOMAIN}/uploads/invoices/${this.order.sevdesk_doc_id}.pdf`;
	}

	openLink(_type: string): void {

		if (_type == 'photo') {
			window.open(this.imageUrl, '_blank');
		} else {
			window.open(this.pdfUrl, '_blank');
		}

		this.bottomSheetRef.dismiss();
		event.preventDefault();

	}

	ngOnInit() {
	}

}
