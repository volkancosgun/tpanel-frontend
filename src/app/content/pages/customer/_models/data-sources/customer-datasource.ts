import { Observable, of } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { BaseDataSource } from '../../../_balamir/data-sources/_base.datasource';
import { CustomerService } from '../../_services/customer.service';
import { QParamsModel } from '../../../_balamir/models/q-models/q-params.model';
import { QResultsModel } from '../../../_balamir/models/q-models/q-results.model';


export class CustomerDataSource extends BaseDataSource {
	constructor(
		private customerService: CustomerService
	) {
		super();
	}

	loadCustomer(queryParams: QParamsModel) {
		// Filtrele
		this.customerService.lastFilter$.next(queryParams);
		// Loading 
		this.loadingSubject.next(true);
		this.customerService.findCustomer(queryParams)
			.pipe(
			tap(res => {
				const result = this.baseFilter(res.items, queryParams, ['group_id', 'status']);
				this.entitySubject.next(result.items);
				// Toplam veri
				this.paginatorTotalSubject.next(result.totalCount);
			}),
			catchError(err => of(new QResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
			).subscribe();
	}

}