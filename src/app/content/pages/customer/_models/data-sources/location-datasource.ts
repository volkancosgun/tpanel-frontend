import { Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { BaseDataSource } from '../../../_balamir/data-sources/_base.datasource';
import { CustomerService } from '../../_services/customer.service';
import { QParamsModel } from '../../../_balamir/models/q-models/q-params.model';
import { QResultsModel } from '../../../_balamir/models/q-models/q-results.model';

export class LocationDataSource extends BaseDataSource {
	constructor(
		private customerService: CustomerService
	) {
		super();
	}

	loadLocation(queryParams: QParamsModel, customer_id:number) {
		this.customerService.lastFilter$.next(queryParams);

		this.loadingSubject.next(true);
		this.customerService.findLocation(queryParams, customer_id)
		.pipe(
		tap(res => {
			const result = this.baseFilter(res.items, queryParams, ['status']);
			this.entitySubject.next(result.items);
			// Toplam veri
			this.paginatorTotalSubject.next(result.totalCount);
		}),
		catchError(err => of(new QResultsModel([], err))),
		finalize(() => this.loadingSubject.next(false))
		).subscribe();
	}
}
