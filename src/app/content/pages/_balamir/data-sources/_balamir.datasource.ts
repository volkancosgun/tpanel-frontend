import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, from } from 'rxjs';
import * as _ from 'lodash';

// Why not use MatTableDataSource?
/* In this example, we will not be using the built-in MatTableDataSource because its designed for filtering,
  sorting and pagination of a client - side data array.
  Read the article: 'https://blog.angular-university.io/angular-material-data-table/'
**/
export class BalamirDataSource implements DataSource<any> {
  entitySubject = new BehaviorSubject([]);
  hasItems: boolean = false; // Need to show message: 'No records found'

  // Loading | Progress bar
  loadingSubject = new BehaviorSubject(false);
  loading$: Observable<any>;

  // Paginator | Paginators count
  paginatorTotalSubject = new BehaviorSubject(0);
  paginatorTotal$: Observable<any>;

  constructor() {
    this.loading$ = this.loadingSubject.asObservable();
    this.paginatorTotal$ = this.paginatorTotalSubject.asObservable();
    this.paginatorTotal$.subscribe(res => this.hasItems = res > 0);
  }

  connect(collectionViewer: CollectionViewer): Observable<any> {
    // Connecting data source
    return this.entitySubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    // Disonnecting data source
    this.entitySubject.complete();
    this.loadingSubject.complete();
    this.paginatorTotalSubject.complete();
  }
}