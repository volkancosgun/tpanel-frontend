import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../customer/_services/customer.service';
import { CustomerModel } from '../../customer/_models/customer.model';
import { MatDialogRef } from '@angular/material';
import { SettingsService } from '../_services/settings.service';
import { LayoutUtilsService, MessageType } from '../../_balamir/utils/layout-utils.service';

@Component({
	selector: 'm-sevdesk-transfer-dialog',
	templateUrl: './sevdesk-transfer-dialog.component.html',
	styleUrls: ['./sevdesk-transfer-dialog.component.scss']
})
export class SevdeskTransferDialogComponent implements OnInit {

	pValue: number = 0;
	totalData: number = 0;
	halfTime: any = [];
	transferTime: any = [{ h: 0, m: 0, s: 0 }];
	items: any = [];
	constructor(
		public dialogRef: MatDialogRef<SevdeskTransferDialogComponent>,
		private customerService: CustomerService,
		private settingsService: SettingsService,
		private layoutUtilsService: LayoutUtilsService
	) { }

	ngOnInit() {
		this.startTransfer();
	}


	startTransfer() {
		let customers = this.customerService.list().subscribe((res: CustomerModel[]) => {


			let interval = 3000;
			let total = res.length;
			let totalInterval = interval * total;
			this.halfTime = this.secondsToTime(totalInterval);



			if (!total) {

				this.layoutUtilsService.showActionNotification('Sistemde kayıtlı aktarılacak müşteri bulunmuyor.', MessageType.Read, 3000);

				this.onCancel();
				return false;
			}

			const $this = this;
			res.forEach((el, index) => {
				index++;
				this.items.push({ color: 'primary', name: `${el.name} ${el.sur_name || ''}, bekliyor...`, id: el.id });
				this.transferTime.push(setTimeout(() => {


					this.items.find(x => x.id === el.id).name = `${el.name} ${el.sur_name || ''}, ekleniyor lütfen bekleyiniz...`;
					
					const customerId = el.id;

					this.settingsService.sevdeskTransferById(customerId).subscribe((res: any) => {
						
						let cName = `${el.name} ${el.sur_name || ''},  ${res.msg || 'başarıyla eklendi.'}`;
						let cColor = 'accent';

						if (res.error == true) {
							cColor = 'warn';
						}

						this.items.find(x => x.id === el.id).color = cColor;
						this.items.find(x => x.id === el.id).name = cName;

					});

					let partial = interval * index;
					let hTime = totalInterval - partial;
					this.halfTime = this.secondsToTime(hTime);
					$this.pValue = $this.percentage(partial, totalInterval);

				}, index * interval));

			});


		});
	}

	stopTimeouts() {
		this.transferTime.forEach(id => {
			clearTimeout(id);
		});

	}

	secondsToTime(secs) {
		secs = Math.floor(secs / 1000);
		var hours = Math.floor(secs / (60 * 60));

		var divisor_for_minutes = secs % (60 * 60);
		var minutes = Math.floor(divisor_for_minutes / 60);

		var divisor_for_seconds = divisor_for_minutes % 60;
		var seconds = Math.ceil(divisor_for_seconds);

		var obj = {
			"h": hours,
			"m": minutes,
			"s": seconds
		};

		return obj;
	}

	percentage(partialValue, totalValue) {
		let re = (100 * partialValue) / totalValue;
		return (100 * partialValue) / totalValue;
	}

	onCancel() {
		this.stopTimeouts();
		this.dialogRef.close();
	}

}
