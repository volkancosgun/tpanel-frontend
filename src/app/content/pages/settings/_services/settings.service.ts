import { Injectable } from "@angular/core";
import { balamir } from "../../../../../environments/balamir";
import { HttpClient } from "@angular/common/http";
import { SevdeskModel } from "../_models/sevdesk.model";
import { Observable } from "rxjs";

@Injectable()
export class SettingsService {
	constructor(
		private _http: HttpClient
	) {

	}

	sevdeskSetup(sevdesk: SevdeskModel): Observable<SevdeskModel> {
		return this._http.post<SevdeskModel>(`${balamir.API_URL}/setting/sevdesk/setup`, sevdesk);
	}

	sevdeskReset() {
		return this._http.get(`${balamir.API_URL}/setting/sevdesk/reset`);
	}

	sevdeskTransferById(customerId: number): Observable<any> {
		return this._http.get<any>(`${balamir.API_URL}/setting/sevdesk/transfer/my/${customerId}`);
	}

	getSettings(): Observable<any> {
		return this._http.get<any>(`${balamir.API_URL}/setting/show`);
	}
}