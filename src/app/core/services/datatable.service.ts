import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { mergeMap, tap, finalize, catchError, timeout, delay } from 'rxjs/operators';
import { DataTableItemModel } from '../models/datatable-item.model';

const API_DATATABLE_URL = 'api/cars';

@Injectable()
export class DataTableService {

	constructor(private http: HttpClient) { }
}
