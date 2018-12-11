import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'm-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<ConfirmDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	ngOnInit() {
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	onYesClick(): void {
		this.dialogRef.close(true);
	}

}
