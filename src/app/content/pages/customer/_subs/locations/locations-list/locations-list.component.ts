import { Component, OnInit, ElementRef, ViewChild, Input, ChangeDetectionStrategy } from '@angular/core';
// MAterial
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
// RXJS
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, merge, BehaviorSubject } from 'rxjs';
// Services
import { LayoutUtilsService, MessageType } from '../../../../_balamir/utils/layout-utils.service';
import { CustomerService } from '../../../_services/customer.service';
// Models
import { QParamsModel } from '../../../../_balamir/models/q-models/q-params.model';
import { CustomerLocationsModel } from '../../../_models/customer-locations.model';
// Components
import { ListStateModel } from '../../../../_balamir/utils/list-state.model';
import { LocationsEditComponent } from '../locations-edit/locations-edit.component';
import { LocationDataSource } from '../../../_models/data-sources/location-datasource';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'm-locations-list',
	templateUrl: './locations-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationsListComponent implements OnInit {
	// TABLO 
	dataSource: LocationDataSource;
	locationResult: CustomerLocationsModel[] = [];
	displayedColumns = ['select', 'location_type', 'address', 'actions'];

	// SAYFALAMA
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	// FILTRELEME
	//@ViewChild('searchInput') searchInput: ElementRef;
	//filterStatus: string = "";
	//filterGroup: number = 0;
	selection = new SelectionModel<CustomerLocationsModel>(true, []);

	@Input() loadingSubject = new BehaviorSubject<boolean>(false);
	@Input() locationListState: ListStateModel;
	@Input() customerId: number;
	constructor(
		private translate: TranslateService,
		private customerService: CustomerService,
		private layoutUtilsService: LayoutUtilsService,
		private dialog: MatDialog
	) {

	}

	ngOnInit() {
		// Tablo dilini başlat
		this.initLang();

		// Tablo Başlangıç sıfırla
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

		merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => {
				this.loadLocationList();
			})
		).subscribe();

		// Arama eventi
		/* fromEvent(this.searchInput.nativeElement, 'keyup')
			.pipe(
			debounceTime(150),
			distinctUntilChanged(),
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadLocationList();
			})
		).subscribe(); */

		// Tablo verileri
		this.dataSource = new LocationDataSource(this.customerService);
		let qParams = new QParamsModel({});

		this.dataSource.loading$.subscribe(res => {
			this.loadingSubject.next(res);
		});

		this.loadLocationList();

		// verileri değişkene ata
		this.dataSource.entitySubject.subscribe(res => (this.locationResult = res));

	}

	initLang() {
		this.paginator._intl.itemsPerPageLabel = this.translate.instant('TABLE.PAGINATION.LABEL_PER_PAGE');
		this.paginator._intl.previousPageLabel = this.translate.instant('TABLE.PAGINATION.LABEL_PREV_PAGE');
		this.paginator._intl.nextPageLabel = this.translate.instant('TABLE.PAGINATION.LABEL_NEXT_PAGE');
		this.paginator._intl.firstPageLabel = this.translate.instant('TABLE.PAGINATION.LABEL_FIRST_PAGE');
		this.paginator._intl.lastPageLabel = this.translate.instant('TABLE.PAGINATION.LABEL_LAST_PAGE');

	}

	loadLocationList() {
		const qParams = new QParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);

		this.dataSource.loadLocation(qParams, this.customerId);
	}

	filterConfiguration(): any {
		const filter: any = {};
		//const searchText: string = this.searchInput.nativeElement.value;

		/* if (this.filterStatus && this.filterStatus.length > 0) {
			filter.status = +this.filterStatus;
		} */

		//filter.address = searchText;

		return filter;
	}

	addLocation() {
		let newLocation = new CustomerLocationsModel();
		newLocation.clear();
		const dialogRef = this.dialog.open(LocationsEditComponent, {
			data: {
				locationType: 'BUSINESS',
				isNew: true,
			},
			width: '680px'
		});

		dialogRef.afterClosed().subscribe(res => {
			if (res && res.isUpdated) {
				// Lokasyon bilgilerini kaydet
				this.loadingSubject.next(true);
				this.customerService.locationCreate(res, this.customerId).subscribe(res => {
					this.loadingSubject.next(false);
					this.loadLocationList();
					const message = `${this.translate.instant('CUSTOMER.BALAMIR.CREATE_LOCATION')}`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, false);
				});
			}
		});
	}

	editLocation(_item: CustomerLocationsModel) {
		const dialogRef = this.dialog.open(LocationsEditComponent, {
			data: {
				updateValues: _item,
				isNew: false
			},
			width: '680px'
		});
		dialogRef.afterClosed().subscribe(res => {
			if (res && res.isUpdated) {
				// Lokasyon bilgilerini düzenle
				this.loadingSubject.next(true);
				this.customerService.locationEdit(res, _item.id).subscribe(res => {
					this.loadingSubject.next(false);
					this.loadLocationList();
					const message = `${this.translate.instant('CUSTOMER.BALAMIR.UPDATE_LOCATION')}`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 10000, true, false);
				})
			}
		})
	}

	deleteLocation(_item: CustomerLocationsModel) {
		const itemName = `<strong>${_item.address}</strong>`;
		const _title: string = this.translate.instant('BALAMIR.DIALOG.DELETE.TITLE');
		const _desc: string = this.translate.instant('BALAMIR.DIALOG.DELETE.DESC_ITEM', { name: itemName });
		const _waitDesc: string = this.translate.instant('BALAMIR.DIALOG.LOADING.DELETE_ITEM', { name: itemName });
		const _deleteMessage: string = this.translate.instant('BALAMIR.DIALOG.DELETE.SUCCESS_ITEM', { name: itemName });

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _desc, _waitDesc);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.loadingSubject.next(true);
			this.customerService.locationDelete(_item.id).subscribe(() => {
				this.loadingSubject.next(false);
				this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				this.loadLocationList();
			});
		});
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.locationResult.length;
		return numSelected === numRows;
	}

	masterToggle() {
		if (this.selection.selected.length === this.locationResult.length) {
			this.selection.clear();
		} else {
			this.locationResult.forEach(row => this.selection.select(row));
		}
	}

	getLangLocationType(location_type): string {
		return this.translate.instant(`CUSTOMER.LOCATION.TYPES.${location_type}`);
	}

	fetchLocations() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${this.getLangLocationType(elem.location_type)} - ${elem.address || ''} - ${elem.lat} - ${elem.lng}`,
				id: elem.id.toString(),
				status: elem.status
			})
		});

		this.layoutUtilsService.fetchElements(messages);
	}

	deleteLocations() {
		const count = `<strong>${this.selection.selected.length}</strong>`;
		const _title: string = this.translate.instant('BALAMIR.DIALOG.DELETE.TITLE');
		const _description: string = this.translate.instant('BALAMIR.DIALOG.DELETE.MULTI_DESC_COUNT', { count: count });
		const _waitDesciption: string = this.translate.instant('BALAMIR.DIALOG.LOADING.DELETE_ITEM_MULTI');
		const _deleteMessage = this.translate.instant('BALAMIR.DIALOG.DELETE.SUCCESS_ITEM_MULTI', { count: count });

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			const idsForDeletion: number[] = [];
			for (let i = 0; i < this.selection.selected.length; i++) {
				idsForDeletion.push(this.selection.selected[i].id);
			}

			this.customerService.deleteLocations(idsForDeletion).subscribe(() => {
				this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
				this.loadLocationList();
				this.selection.clear();
			});

		});
	}
}