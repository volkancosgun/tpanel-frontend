import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
	selector: 'm-show-loader',
	templateUrl: './show-loader.component.html',
	styleUrls: ['./show-loader.component.scss']
})
export class ShowLoaderComponent implements OnInit {

	timeout: number = 10000;
	constructor(
		public dialogRef: MatDialogRef<ShowLoaderComponent>,
		@Inject(MAT_DIALOG_DATA) public msg: string,
	) {
	}

	ngOnInit() {

		setTimeout(() => {
			this.dialogRef.close();
		}, this.timeout);

	}

}
