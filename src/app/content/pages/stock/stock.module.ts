import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockRoutingModule } from './stock.routing.module';
import { SharedModule } from '../../shared/shared.module';
import { StockService } from './_services/stock.service';
import { StockStoreListComponent } from './stock-store-list/stock-store-list.component';
import { StockStoreEditComponent } from './stock-store-edit/stock-store-edit.component';
import { StocksStoreEditDialogComponent } from './_dialogs/stocks-store-edit-dialog/stocks-store-edit-dialog.component';

@NgModule({
	imports: [
		CommonModule,
		StockRoutingModule,
		SharedModule
	],
	declarations: [
		StockStoreListComponent,
		StockStoreEditComponent,
		StocksStoreEditDialogComponent,
	],
	entryComponents: [
		StocksStoreEditDialogComponent,
	],
	providers: [
		StockService
	]
})
export class StockModule { }
