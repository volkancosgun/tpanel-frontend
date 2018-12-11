import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingRoutingModule } from './settings-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SevdeskComponent } from './sevdesk/sevdesk.component';
import { SettingsService } from './_services/settings.service';
import { SharedModule } from '../../shared/shared.module';
import { SevdeskEditComponent } from './sevdesk-edit/sevdesk-edit.component';
import { SevdeskEditDialogComponent } from './sevdesk-edit-dialog/sevdesk-edit-dialog.component';
import { CustomerService } from '../customer/_services/customer.service';
import { SevdeskTransferDialogComponent } from './sevdesk-transfer-dialog/sevdesk-transfer-dialog.component';

@NgModule({
	imports: [
		CommonModule,
		SettingRoutingModule,
		SharedModule,
		NgbModule
	],
	declarations: [
		SevdeskComponent,
		SevdeskEditComponent,
		SevdeskEditDialogComponent,
		SevdeskTransferDialogComponent
	],
	entryComponents: [
		SevdeskEditDialogComponent,
		SevdeskTransferDialogComponent
	],
	providers: [
		SettingsService,
		CustomerService
	]
})
export class SettingsModule { }
