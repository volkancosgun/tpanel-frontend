import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StoreModel } from '../_models/store-model';
import { Observable } from 'rxjs/Observable';
import { balamir } from '../../../../../environments/balamir';

@Injectable()
export class StockService {

	constructor(
		private _http: HttpClient
	) { }

	createStore(store: StoreModel): Observable<StoreModel> {
		return this._http.post<StoreModel>(`${balamir.API_URL}/store/create`, store);
	}

	listStore(): Observable<StoreModel[]> {
		return this._http.get<StoreModel[]>(`${balamir.API_URL}/store/list`);
	}

}
