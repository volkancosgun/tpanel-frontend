import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { SevdeskModel } from '../_models/sevdesk.model';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { SevdeskEditComponent } from '../sevdesk-edit/sevdesk-edit.component';
import { SevdeskEditDialogComponent } from '../sevdesk-edit-dialog/sevdesk-edit-dialog.component';
import { LayoutUtilsService, MessageType } from '../../_balamir/utils/layout-utils.service';
import { SettingsService } from '../_services/settings.service';
import { TranslateService } from '@ngx-translate/core';
import { CustomerService } from '../../customer/_services/customer.service';
import { CustomerModel } from '../../customer/_models/customer.model';
import { SevdeskTransferDialogComponent } from '../sevdesk-transfer-dialog/sevdesk-transfer-dialog.component';

@Component({
	selector: 'm-sevdesk',
	templateUrl: './sevdesk.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SevdeskComponent implements OnInit {

	sevDeskApiKey: string = null;
	sevDeskUserId: string = null;
	sevDeskFullName: string = null;
	sevDeskEmail: string = null;
	constructor(
		private dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private settingsService: SettingsService,
		private customerService: CustomerService,
		private translate: TranslateService,
		private cdr: ChangeDetectorRef
	) {

	}

	ngOnInit() {
		this.sevdeskInfo();

	}

	sevdeskInfo() {
		this.settingsService.getSettings().subscribe((res: any) => {
			this.sevDeskApiKey = res.sevdesk_apikey;
			this.sevDeskUserId = res.sevdesk_userid;
			this.sevDeskFullName = res.sevdesk_fullname;
			this.sevDeskEmail = res.sevdesk_email;
			this.cdr.detectChanges();
		});
	}

	setupApiKey() {
		const newApiKey = new SevdeskModel();
		newApiKey.clear();
		this.editApiKey(newApiKey);
	}

	editedApiKey() {
		const editApiKey = new SevdeskModel();
		editApiKey.key = this.sevDeskApiKey;
		this.editApiKey(editApiKey, true);
	}

	removeApiKey() {

		const _title: string = this.translate.instant('BALAMIR.DIALOG.DELETE.TITLE');
		const _desc: string = `<strong>${this.sevDeskApiKey}</strong><br>Bu API Key anahtarına sahip bağlantıyı silmek istediğinize emin misiniz?`;
		const _waitDesc: string = 'API Bağlantısı siliniyor, lütfen bekleyiniz...';
		const _deleteMessage: string = 'API bağlantısı başarıyla silindi.';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _desc, _waitDesc);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.settingsService.sevdeskReset().subscribe((res: any) => {
				this.sevdeskInfo();
			});

		});

	}

	editApiKey(sevdesk: SevdeskModel, _isEdit: boolean = false) {
		const dialogRef = this.dialog.open(SevdeskEditDialogComponent, { data: { sevdesk, isEdit: _isEdit } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			if (res._sevdesk.cTransfer) {
				this.startTransfer();
			}

			this.sevdeskInfo();
			this.storeActionNotification(res);
		})
	}

	storeActionNotification(res) {
		let _sevdesk = res._res;
		let _saveMessage = `<strong>${_sevdesk.sevdesk_fullname} (${_sevdesk.sevdesk_email})</strong> <br>sevDesk API bağlantısı`;
		_saveMessage += res._isEdit ? ' düzenlendi.' : ' kuruldu.';
		const _messageType = _sevdesk._isEdit ? MessageType.Update : MessageType.Create;
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 5000, true, false);
	}

	startTransfer() {

		const dialogRef = this.dialog.open(SevdeskTransferDialogComponent, {disableClose:true});
		dialogRef.afterClosed().subscribe(res => {
			console.log('Aktarma işlemi bitti');
		});
	}
}
