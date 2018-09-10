import { BaseDataSource } from "../../../_balamir/data-sources/_base.datasource";
import { OrderService } from "../../_services/order.service";
import { QParamsModel } from "../../../_balamir/models/q-models/q-params.model";
import { Observable, of } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { QResultsModel } from "../../../_balamir/models/q-models/q-results.model";

export class OrderDataSource extends BaseDataSource {
	constructor(
		private orderService: OrderService
	) {
		super();
	}

	loadOrders(qParams: QParamsModel) {
		this.orderService.lastFilter$.next(qParams);

		this.loadingSubject.next(true);
		this.orderService.getOrders(qParams)
			.pipe(
			tap(res => {
				const result = this.baseFilter(res.items, qParams, ['status']);
				this.entitySubject.next(result.items);

				this.paginatorTotalSubject.next(result.totalCount);
			}),
			catchError(err => of(new QResultsModel([], err))),
			finalize(() => this.loadingSubject.next(false))
			).subscribe();
	}
}