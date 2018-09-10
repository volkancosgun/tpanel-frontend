import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapSearchDirective } from '../../core/directives/map-search.directive';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxCurrencyModule } from "ngx-currency";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ngx-currency/src/currency-mask.config";

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: "left",
    allowNegative: true,
    allowZero: true,
    decimal: ",",
    precision: 2,
    prefix: "",
    suffix: "",
    thousands: ".",
    nullable: true
};

import { TokenInterceptor } from '../../core/interceptors/token.interceptor';
import { RefreshTokenInterceptor } from '../../core/interceptors/refresh-token.interceptor';
import { AlertComponent } from '../pages/_balamir/shared/alert/alert.component';

// Material
import {
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatTableModule,
	MatSelectModule,
	MatMenuModule,
	MatGridListModule,
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
import { NgSelectModule, NG_SELECT_DEFAULT_CONFIG } from '@ng-select/ng-select';

import { LayoutUtilsService } from '../pages/_balamir/utils/layout-utils.service';
import { PartialsModule } from '../partials/partials.module';
import { ActionNotificationComponent } from '../pages/_balamir/shared/action-natification/action-notification.component';
import { DeleteEntityDialogComponent } from '../pages/_balamir/shared/delete-entity-dialog/delete-entity-dialog.component';
import { PortletModule } from '../partials/content/general/portlet/portlet.module';
import { FetchEntityDialogComponent } from '../pages/_balamir/shared/fetch-entity-dialog/fetch-entity-dialog.component';
import { UpdateStatusDialogComponent } from '../pages/_balamir/shared/update-status-dialog/update-status-dialog.component';
import { TypesUtilsService } from '../pages/_balamir/utils/types-utils.service';
import { HttpUtilsService } from '../pages/_balamir/utils/http-utils.service';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		PartialsModule,
		HttpClientModule,
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyBpc-nqt0XbiSWyNWucoE3VtWHc9YBspeI',
			libraries: ["places"],
			language: 'de'
		}),
		TranslateModule.forChild(),
		NgxCurrencyModule,
		NgSelectModule,
		// Material
		MatDialogModule,
		MatButtonModule,
		MatMenuModule,
		MatGridListModule,
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
		AlertComponent,
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
	],
	declarations: [
		MapSearchDirective,
		// Balamir
		AlertComponent,
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
	],
	exports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		AgmCoreModule,
		MapSearchDirective,
		HttpClientModule,
		TranslateModule,
		NgxCurrencyModule,
		NgSelectModule,
		// Material
		MatDialogModule,
		MatButtonModule,
		MatMenuModule,
		MatGridListModule,
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
		// Balamir
		AlertComponent,
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		// Partials
		PartialsModule
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },
		{ provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'm-mat-dialog-container__wrapper',
				height: 'auto',
				width: '900px'
			}
		},
		{
            provide: NG_SELECT_DEFAULT_CONFIG,
            useValue: {
                notFoundText: 'Bulunamadı...'
            }
        },
		LayoutUtilsService,
		TypesUtilsService,
		HttpUtilsService
	]
})
export class SharedModule { }