import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './customer.routing.module';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { CustomerGroupEditComponent } from './customer-group-edit/customer-group-edit.component';
import { CustomerGroupsComponent } from './customer-groups/customer-groups.component';
import { CustomerService } from './_services/customer.service';

// Material
import {
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatTableModule,
	MatSelectModule,
	MatMenuModule,
	MatProgressBarModule,
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule,
	MatTabsModule,
	MatNativeDateModule,
	MatCardModule,
	MatRadioModule,
	MatIconModule,
	MatDatepickerModule,
	MatAutocompleteModule,
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatSnackBarModule,
	MatTooltipModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../partials/partials.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { HttpUtilsService } from '../_balamir/utils/http-utils.service';
import { TypesUtilsService } from '../_balamir/utils/types-utils.service';
import { LayoutUtilsService } from '../_balamir/utils/layout-utils.service';
import { ActionNotificationComponent } from '../_balamir/shared/action-natification/action-notification.component';
import { DeleteEntityDialogComponent } from '../_balamir/shared/delete-entity-dialog/delete-entity-dialog.component';
import { FetchEntityDialogComponent } from '../_balamir/shared/fetch-entity-dialog/fetch-entity-dialog.component';
import { UpdateStatusDialogComponent } from '../_balamir/shared/update-status-dialog/update-status-dialog.component';

import { AlertComponent } from '../_balamir/shared/alert/alert.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../../../core/interceptors/token.interceptor';
import { RefreshTokenInterceptor } from '../../../core/interceptors/refresh-token.interceptor';
import { LocationsEditComponent } from './_subs/locations/locations-edit/locations-edit.component';
import { LocationsListComponent } from './_subs/locations/locations-list/locations-list.component';


@NgModule({
	imports: [
		MatDialogModule,
		CommonModule,
		HttpClientModule,
		SharedModule,
		PartialsModule,
		FormsModule,
		ReactiveFormsModule,
		CustomerRoutingModule,
		TranslateModule.forChild(),
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
        MatInputModule,
		MatTableModule,
		MatAutocompleteModule,
		MatRadioModule,
		MatIconModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatDatepickerModule,
		MatCardModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatTabsModule,
		MatTooltipModule,
	],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		LocationsEditComponent
	],
	declarations: [
		CustomerDashboardComponent,
		CustomerListComponent,
		CustomerEditComponent,
		CustomerGroupEditComponent,
		CustomerGroupsComponent,
		LocationsEditComponent,
		LocationsListComponent,
		// Balamir
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		AlertComponent
	],
	providers: [
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'm-mat-dialog-container__wrapper',
				height: 'auto',
				width: '900px'
			}
		},
		{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },
		CustomerService,
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService
	]
})
export class CustomerModule { }
