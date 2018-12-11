import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SevdeskModel } from '../_models/sevdesk.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingsService } from '../_services/settings.service';

@Component({
	selector: 'm-sevdesk-edit-dialog',
	templateUrl: './sevdesk-edit-dialog.component.html',
	styleUrls: ['./sevdesk-edit-dialog.component.scss']
})
export class SevdeskEditDialogComponent implements OnInit {

	sevdesk: SevdeskModel;
	isEdit: boolean = false;
	sevDeskForm: FormGroup;
	sevDeskKeyError: boolean = false;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	constructor(
		public dialogRef: MatDialogRef<SevdeskEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private settingsService: SettingsService
	) { }

	ngOnInit() {

		this.sevdesk = this.data.sevdesk;
		this.isEdit = this.data.isEdit;
		this.createForm();
	}

	createForm() {
		this.sevDeskForm = this.fb.group({
			apiKey: [this.sevdesk.key, [Validators.required]],
			cTransfer: [false]
		});
	}

	onSubmit() {
		this.hasFormErrors = false;

		const controls = this.sevDeskForm.controls;

		if (this.sevDeskForm.invalid) {
			Object.keys(controls).forEach(controlName => {
				controls[controlName].markAsTouched();
			});

			this.hasFormErrors = true;
			return;
		}

		const editedSevdesk = this.prepareSevdesk();
		this.storeSevdesk(editedSevdesk);
	}

	prepareSevdesk(): SevdeskModel {
		const controls = this.sevDeskForm.controls;
		const _sevdesk = new SevdeskModel();

		_sevdesk.key = controls['apiKey'].value;
		_sevdesk['cTransfer'] = controls['cTransfer'].value;

		return _sevdesk;

	}

	storeSevdesk(_sevdesk: SevdeskModel) {
		this.sevDeskKeyError = false;
		this.viewLoading = true;

		this.settingsService.sevdeskSetup(_sevdesk).subscribe((res: any) => {
			this.viewLoading = false;

			if (res.status == false) {
				this.sevDeskKeyError = true;
				return;
			}

			this.dialogRef.close({
				_sevdesk,
				_res: res,
				_isEdit: this.isEdit
			});

		});

	}

	getTitle(): String {
		let _title = 'sevDesk API';

		if (this.sevdesk.key) {
			_title += ' Düzenle';
		} else {
			_title += ' Kurulum Sihirbazı';
		}

		return _title;

	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	onCancel(): void {
		this.dialogRef.close();
	}

}
