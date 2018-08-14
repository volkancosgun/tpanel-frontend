import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, BehaviorSubject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { balamir } from '../../../../../environments/balamir';
import { QParamsModel } from '../../_balamir/models/q-models/q-params.model';
import { QResultsModel } from '../../_balamir/models/q-models/q-results.model';
import { HttpUtilsService } from '../../_balamir/utils/http-utils.service';
import { CustomerGroupModel } from '../_models/customer-group.model';
import { CustomerModel } from '../_models/customer.model';
import { CustomerLocationsModel } from '../_models/customer-locations.model';

@Injectable()
export class CustomerService {
	lastFilter$: BehaviorSubject<QParamsModel> = new BehaviorSubject(new QParamsModel({}, 'desc', '', 0, 10));
	constructor(
		private http: HttpClient,
		private httpUtils: HttpUtilsService
	) {

	}

	updateStatusGroup(group: CustomerGroupModel): Observable<any> {
		return this.http.post(`${balamir.API_URL}/customer/group/update/${group.id}`, group, this.httpUtils.getHTTPHeader());
	}

	updateStatusForGroup(groups: CustomerGroupModel[], status: number): Observable<any> {
		const tasks$ = [];
		for (let i = 0; i < groups.length; i++) {
			const _group = groups[i];
			_group.status = status;
			tasks$.push(this.updateStatusGroup(_group));
		}
		return forkJoin(tasks$);
	}

	updateStatusForCustomer(customers: CustomerModel[], status: number): Observable<any> {
		const tasks$ = [];
		for (let i = 0; i < customers.length; i++) {
			const _customer = customers[i];
			_customer.status = status;
			tasks$.push(this.edit(_customer));
		}
		return forkJoin(tasks$);
	}

	findCustomer(queryParams: QParamsModel): Observable<QResultsModel> {
		const params = this.httpUtils.getFindHTTPParams(queryParams);

		return this.http.get<CustomerModel[]>(`${balamir.API_URL}/customer/list`).pipe(
			mergeMap(res => of(new QResultsModel(res)))
		);
	}

	findLocation(queryParams: QParamsModel, customer_id:number): Observable<QResultsModel> {
		const params = this.httpUtils.getFindHTTPParams(queryParams);
		return this.http.get<CustomerLocationsModel[]>(`${balamir.API_URL}/customer/location/my/${customer_id}`).pipe(
			mergeMap(res => of(new QResultsModel(res)))
		);
	}

	customerGetById(pid: number): Observable<CustomerModel> {
		return this.http.get<CustomerModel>(`${balamir.API_URL}/customer/${pid}`);
	}

	customerCreate(data): Observable<CustomerModel> {
		return this.http.post<CustomerModel>(`${balamir.API_URL}/customer/create`, data);
	}

	deleteCustomers(ids: number[] = []) {
		const taks$ = [];
		const length = ids.length;
		for (let i = 0; i < length; i++) {
			taks$.push(this.delete(ids[i]));
		}

		return forkJoin(taks$);
	}

	deleteLocations(ids: number[] = []) {
		const taks$ = [];
		const length = ids.length;
		for (let i = 0; i < length; i++) {
			taks$.push(this.locationDelete(ids[i]));
		}

		return forkJoin(taks$);
	}

	findCustomerGroups(queryParams: QParamsModel): Observable<QResultsModel> {
		const params = this.httpUtils.getFindHTTPParams(queryParams);

		return this.http.get<CustomerGroupModel[]>(`${balamir.API_URL}/customer/group/list`).pipe(
			mergeMap(res => of(new QResultsModel(res)))
		);
	}

	getCustomerGroups(): Observable<CustomerGroupModel[]> {
		return this.http.get<CustomerGroupModel[]>(`${balamir.API_URL}/customer/group/list`);
	}

	deleteCustomerGroups(ids: number[] = []) {
		const taks$ = [];
		const length = ids.length;
		for (let i = 0; i < length; i++) {
			taks$.push(this.groupDelete(ids[i]));
		}

		return forkJoin(taks$);
	}

	create(data) {
		return this.http.post(`${balamir.API_URL}/customer/create`, data);
	}

	list() {
		return this.http.get(`${balamir.API_URL}/customer/list`);
	}

	getById(pid) {
		return this.http.get(`${balamir.API_URL}/customer/${pid}`);
	}

	edit(customer: CustomerModel): Observable<any>  {
		return this.http.post(`${balamir.API_URL}/customer/update/${customer.id}`, customer, this.httpUtils.getHTTPHeader());
	}

	delete(pid) {
		return this.http.get(`${balamir.API_URL}/customer/delete/${pid}`);
	}

	groupCreate(data): Observable<CustomerGroupModel> {
		return this.http.post<CustomerGroupModel>(`${balamir.API_URL}/customer/group/create`, data);
	}

	groupList(): Observable<CustomerGroupModel[]> {
		return this.http.get<CustomerGroupModel[]>(`${balamir.API_URL}/customer/group/list`);
	}

	groupEdit(data, pid) {
		return this.http.post(`${balamir.API_URL}/customer/group/update/${pid}`, data);
	}

	groupUpdate(group: CustomerGroupModel): Observable<any> {
		return this.http.post(`${balamir.API_URL}/customer/group/update/${group.id}`, group, this.httpUtils.getHTTPHeader());
	}

	groupDelete(pid: number): Observable<CustomerGroupModel> {
		return this.http.get<CustomerGroupModel>(`${balamir.API_URL}/customer/group/delete/${pid}`);
		//return this.http.get(`${balamir.API_URL}/customer/group/delete/${pid}`);
	}

	groupGetById(pid:number): Observable<CustomerGroupModel> {
		return this.http.get<CustomerGroupModel>(`${balamir.API_URL}/customer/group/${pid}`);
	}

	locationGetById(pid) {
		return this.http.get(`${balamir.API_URL}/customer/location/${pid}`);
	}

	locationCreate(data, pid) {
		return this.http.post(`${balamir.API_URL}/customer/location/create/${pid}`, data);
	}

	locationEdit(data, pid) {
		return this.http.post(`${balamir.API_URL}/customer/location/update/${pid}`, data);
	}

	locationDelete(pid) {
		return this.http.get(`${balamir.API_URL}/customer/location/delete/${pid}`);
	}




}
