import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { StoreModel } from '../_models/store-model';
import { MatDialog } from '@angular/material';
import { StocksStoreEditDialogComponent } from '../_dialogs/stocks-store-edit-dialog/stocks-store-edit-dialog.component';
import { StockService } from '../_services/stock.service';
import { LayoutUtilsService } from '../../_balamir/utils/layout-utils.service';

@Component({
	selector: 'm-stock-store-list',
	templateUrl: './stock-store-list.component.html',
	styleUrls: ['./stock-store-list.component.scss']
})
export class StockStoreListComponent implements OnInit {

	viewLoading: boolean = false;

	store: StoreModel;
	stores: StoreModel[];
	constructor(
		private dialog: MatDialog,
		private stockService: StockService,
		private cdr: ChangeDetectorRef,
		private lus: LayoutUtilsService
	) { }

	ngOnInit() {

		this.onLoad();
	}

	newStore(): void {

		const newStoreData = new StoreModel();

		newStoreData.clear();

		this.editStore(newStoreData, false);

	}


	editStore(_store: StoreModel, _isEdit: boolean = true): void {

		this.viewLoading = true;

		const dialogRef = this.dialog.open(StocksStoreEditDialogComponent, {
			data: {
				model: _store,
				isEdit: _isEdit
			},
			disableClose: true,
		});

		dialogRef.afterClosed().subscribe(res => {
			this.onLoad();
		});
	}

	onLoad(): void {

		this.viewLoading = true;
		this.stockService.listStore().subscribe((res: StoreModel[]) => {
			this.stores = res;
			this.viewLoading = false;
			this.cdr.detectChanges();
		});

	}

	storeEdit() {
		this.bakimModu();
	}

	storeDetail() {
		this.bakimModu();
	}

	bakimModu() {
		this.lus.showActionNotification('Bu işlem şuan güncelleniyor.');
	}

	stockOperation(_type: boolean = true) {

		this.bakimModu();

	}

}
