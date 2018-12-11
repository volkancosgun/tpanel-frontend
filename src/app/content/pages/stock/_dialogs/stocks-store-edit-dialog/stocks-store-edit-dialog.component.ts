import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { StoreModel } from '../../_models/store-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LayoutUtilsService, MessageType } from '../../../_balamir/utils/layout-utils.service';
import { StockService } from '../../_services/stock.service';

@Component({
	selector: 'm-stocks-store-edit-dialog',
	templateUrl: './stocks-store-edit-dialog.component.html',
	styleUrls: ['./stocks-store-edit-dialog.component.scss']
})
export class StocksStoreEditDialogComponent implements OnInit {

	store: StoreModel;
	storeForm: FormGroup;
	viewLoading: boolean = false;
	hasFormErrors: boolean = false;
	constructor(
		private fb: FormBuilder,
		public dialogRef: MatDialogRef<StocksStoreEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private layoutUtilsService: LayoutUtilsService,
		private stockSerivce: StockService
	) { }

	ngOnInit(): void {

		this.store = this.data.model;

		this.formInit();
		this.formChanges();

	}

	getTitle(): String {

		let _title = 'Depo';

		if (this.data.isEdit) {
			_title += ' Düzenle';
		} else {
			_title += ' Oluştur';
		}

		return _title;


	}

	formInit(): void {

		this.storeForm = this.fb.group({
			name: [this.store.name, [Validators.required]],
			limit: [this.store.limit, [Validators.required]]
		});

	}

	prepareStore(): StoreModel {

		const _controls = this.storeForm.controls;
		const _store = new StoreModel();

		_store.name = _controls['name'].value;
		_store.limit = _controls['limit'].value;

		return _store;

	}

	onSubmit() {

		const controls = this.storeForm.controls;

		if (this.storeForm.invalid) {

			Object.keys(controls).forEach(controlName => {
				controls[controlName].markAsTouched();
			});

			this.hasFormErrors = true;

			return;
		}

		const store = this.prepareStore();

		this.storeModel(store);


	}

	formChanges(): void {
		this.storeForm.valueChanges.subscribe(value => {
			if (this.hasFormErrors) {
				this.hasFormErrors = false;
			}
		});
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	onCancel(): void {

		if (this.storeForm.valid) {
			this.layoutUtilsService.confirmDialog('Onay', 'Depo oluşturma işleminiz iptal edilecek. Onaylıyor musunuz?', 'Evet, iptal et').afterClosed().subscribe(res => {
				if (res) {
					this.dialogRef.close();
				}
			});
		} else {
			this.dialogRef.close();
		}

	}

	storeModel(store: StoreModel) {

		this.viewLoading = true;


		this.stockSerivce.createStore(store).subscribe((res: any) => {
			if (!res.error) {
				this.dialogRef.close(res);
			}
		});


		/* setTimeout(() => {
			this.viewLoading = false;
		}, 5000);

		console.log(store); */
	}



}
