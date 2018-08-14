import { LayoutModule } from '../layout/layout.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { PartialsModule } from '../partials/partials.module';
import { ActionComponent } from './header/action/action.component';
import { ProfileComponent } from './header/profile/profile.component';
import { CoreModule } from '../../core/core.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule } from '@angular/forms';
import { ErrorPageComponent } from './snippets/error-page/error-page.component';

/** Balamir CORE Imports */
/* import { HttpUtilsService } from './_balamir/utils/http-utils.service';
import { TypesUtilsService } from './_balamir/utils/types-utils.service';
import { LayoutUtilsService } from './_balamir/utils/layout-utils.service';
import { ActionNotificationComponent } from './_balamir/shared/action-natification/action-notification.component';
import { DeleteEntityDialogComponent } from './_balamir/shared/delete-entity-dialog/delete-entity-dialog.component';
import { FetchEntityDialogComponent } from './_balamir/shared/fetch-entity-dialog/fetch-entity-dialog.component';
import { UpdateStatusDialogComponent } from './_balamir/shared/update-status-dialog/update-status-dialog.component';
import { AlertComponent } from './_balamir/shared/alert/alert.component'; */


@NgModule({
	declarations: [
		PagesComponent,
		ActionComponent,
		ProfileComponent,
		ErrorPageComponent,
		/* ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		AlertComponent */
	],
	entryComponents: [
		/* ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		AlertComponent */
	],
	imports: [
		CommonModule,
		FormsModule,
		HttpClientModule,
		PagesRoutingModule,
		CoreModule,
		LayoutModule,
		PartialsModule,
		AngularEditorModule,
	],
	providers: [
		/* HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService */
	]
})
export class PagesModule { }
