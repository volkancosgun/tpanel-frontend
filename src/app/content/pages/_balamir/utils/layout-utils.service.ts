import { Injectable } from '@angular/core';

import { MatSnackBar, MatDialog } from '@angular/material';

import { DeleteEntityDialogComponent } from '../shared/delete-entity-dialog/delete-entity-dialog.component';
import { FetchEntityDialogComponent } from '../shared/fetch-entity-dialog/fetch-entity-dialog.component';
import { UpdateStatusDialogComponent } from '../shared/update-status-dialog/update-status-dialog.component';
import { ActionNotificationComponent } from '../shared/action-natification/action-notification.component';
import { AlertDialogComponent } from '../shared/alert-dialog/alert-dialog.component';
import { ShowLoaderComponent } from '../shared/show-loader/show-loader.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';


export enum MessageType {
	Create,
	Read,
	Update,
	Delete
}

@Injectable()
export class LayoutUtilsService {
	constructor(private snackBar: MatSnackBar,
		private dialog: MatDialog) { }

	// SnackBar for notifications
	showActionNotification(
		message: string,
		type: MessageType = MessageType.Create,
		duration: number = 10000,
		showCloseButton: boolean = true,
		showUndoButton: boolean = false,
		undoButtonDuration: number = 3000,
		verticalPosition: 'top' | 'bottom' = 'top'
	) {
		return this.snackBar.openFromComponent(ActionNotificationComponent, {
			duration: duration,
			data: {
				message,
				snackBar: this.snackBar,
				showCloseButton: showCloseButton,
				showUndoButton: showUndoButton,
				undoButtonDuration,
				verticalPosition,
				type,
				action: 'Undo'
			},
			verticalPosition: verticalPosition
		});
	}

	// Silme penceresi
	deleteElement(title: string = '', description: string = '', waitDesciption: string = '') {
		return this.dialog.open(DeleteEntityDialogComponent, {
			data: { title, description, waitDesciption },
			width: '440px'
		});
	}

	// Onay penceresi
	confirmDialog(title: string = '', msg: string = '', okButton: string = '', cancelButton: string = '') {
		return this.dialog.open(ConfirmDialogComponent, {
			data: { title, msg, okButton, cancelButton },
			width: '440px'
		});
	}

	// Uyari penceresi
	alertDialog(title: string = '', msg: string = '') {
		return this.dialog.open(AlertDialogComponent, {
			data: { title, msg },
			width: '440px'
		});
	}

	// Loader spinner
	showLoader(msg: string = '') {
		return this.dialog.open(ShowLoaderComponent, {
			data: msg,
			width: '440px',
			disableClose: true,
			panelClass: 'transparent',

		});

	}

	// Method returns instance of MatDialog
	fetchElements(_data) {
		return this.dialog.open(FetchEntityDialogComponent, {
			data: _data,
			width: '400px'
		});
	}

	// Method returns instance of MatDialog
	updateStatusForDatas(title, statuses, messages) {
		return this.dialog.open(UpdateStatusDialogComponent, {
			data: { title, statuses, messages },
			width: '480px'
		});
	}
}
