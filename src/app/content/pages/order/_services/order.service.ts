import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { OrderModel } from '../_models/order.model';
import { balamir } from '../../../../../environments/balamir';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { QParamsModel } from '../../_balamir/models/q-models/q-params.model';
import { QResultsModel } from '../../_balamir/models/q-models/q-results.model';
import { OrderItemModel } from '../_models/order-item.model';

@Injectable()
export class OrderService {

	lastFilter$: BehaviorSubject<QParamsModel> = new BehaviorSubject(new QParamsModel({}, 'desc', '', 0, 10));
	constructor(
		private _http: HttpClient
	) {
	}

	getOrders(qParams: QParamsModel): Observable<QResultsModel> {
		return this._http.get<OrderModel[]>(`${balamir.API_URL}/order/list`).pipe(
			mergeMap(res => of(new QResultsModel(res)))
		);
	}

	storeOrder(order: OrderModel): Observable<OrderModel> {
		return this._http.post<OrderModel>(`${balamir.API_URL}/order/store`, order);
	}

	getOrderItems(order_id: number): Observable<OrderItemModel[]> {
		return this._http.get<OrderItemModel[]>(`${balamir.API_URL}/order/item/list/${order_id}`);
	}
}