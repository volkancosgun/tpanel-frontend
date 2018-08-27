import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'm-update-status-dialog',
	templateUrl: './update-status-dialog.component.html'
})
export class UpdateStatusDialogComponent implements OnInit {
	selectedStatusForUpdate = new FormControl('');
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	constructor(
		public dialogRef: MatDialogRef<UpdateStatusDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {}

	ngOnInit() {
		/* Server loading imitation. Remove this */
		this.viewLoading = true;
		setTimeout(() => {
			this.viewLoading = false;
		}, 1000);
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	updateStatus() {
		if (this.selectedStatusForUpdate.value.length === 0) {
			return;
		}

		/* Server loading imitation. Remove this */
		this.viewLoading = true;
		this.loadingAfterSubmit = true;
		setTimeout(() => {
			this.dialogRef.close(this.selectedStatusForUpdate.value); // Keep only this row
		}, 2500);
	}
}
