import { Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { CustomerService } from '../../_services/customer.service';
import { QParamsModel } from '../../../_balamir/models/q-models/q-params.model';
import { QResultsModel } from '../../../_balamir/models/q-models/q-results.model';
import { BaseDataSource } from '../../../_balamir/data-sources/_base.datasource';

export class CustomerGroupDataSource extends BaseDataSource {
	constructor(private customerService: CustomerService) {
		super();
	}

	loadGroups(queryParams: QParamsModel) {
		this.customerService.lastFilter$.next(queryParams);
		this.loadingSubject.next(true);

		this.customerService.findCustomerGroups(queryParams)
			.pipe(
			tap(res => {
				const result = this.baseFilter(res.items, queryParams, ['status']);
				this.entitySubject.next(result.items);
				this.paginatorTotalSubject.next(result.totalCount);
			}),
			catchError(err => of(new QResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
			).subscribe();
	}

	/* loadGroups(
		queryParams: QParamsModel
	) {
		this.loadingSubject.next(true);
		this.customerService.findCustomerGroups(queryParams).pipe(
			tap(res => {
				const result = this.baseFilter(res.items, queryParams, ['status']);
				this.entitySubject.next(result.items);
				this.paginatorTotalSubject.next(result.totalCount);
			}),
			catchError(err => of(new QResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
		).subscribe();
	} */
}