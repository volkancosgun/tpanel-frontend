import { Component, OnInit } from '@angular/core';
import { SubheaderService } from '../../../core/services/layout/subheader.service';


@Component({
	selector: 'm-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

	constructor(
		private subheaderService: SubheaderService,
	) { }

	ngOnInit() {

		this.subheaderService.setTitle('Panel');
		/* this.subheaderService.setTitle(this.translate.instant('DASHBOARD.TITLE'));
		this.subheaderService.setBreadcrumbs([
			{
				title: 'Müşteri Listesi',
				page: '/index'
			},
			{
				title: 'Volkan Coşgun adlı müşteri',
				page: '/profile'
			},

		]); */
	}

}
