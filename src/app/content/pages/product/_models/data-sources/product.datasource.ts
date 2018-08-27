import { Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ProductService } from '../../_services/product.service';
import { QParamsModel } from '../../../_balamir/models/q-models/q-params.model';
import { BaseDataSource } from '../../../_balamir/data-sources/_base.datasource';
import { QResultsModel } from '../../../_balamir/models/q-models/q-results.model';

export class ProductDataSource extends BaseDataSource {
	constructor(
		private productService: ProductService
	) {
		super();
	}

	loadProducts(queryParams: QParamsModel) {
		// Filtrele
		this.productService.lastFilter$.next(queryParams);
		// loading
		this.loadingSubject.next(true);
		this.productService.getProducts(queryParams)
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
}