import { Injectable } from '@angular/core';
import { balamir } from '../../../../../environments/balamir';
import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ProductCategoryModel } from '../_models/product-category.model';
import { HttpClient } from '@angular/common/http';
import { QParamsModel } from '../../_balamir/models/q-models/q-params.model';
import { HttpUtilsService } from '../../_balamir/utils/http-utils.service';
import { QResultsModel } from '../../_balamir/models/q-models/q-results.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ProductModel } from '../_models/product.model';
import { ProductPhotosModel } from '../_models/product-photos.model';
import { ProductBrandModel } from '../_models/product-brand.model';
import { ProductModelModel } from '../_models/product-model.model';

@Injectable()
export class ProductService {
	lastFilter$: BehaviorSubject<QParamsModel> = new BehaviorSubject(new QParamsModel({}, 'desc', '', 0, 10));
	constructor(
		private _http: HttpClient,
		private httpUtils: HttpUtilsService
	) {

	}

	/** Ürün Servisleri */

	storeProduct(product: ProductModel): Observable<ProductModel> {
		return this._http.post<ProductModel>(`${balamir.API_URL}/product/store`, product);
	}

	getProducts(qParams: QParamsModel): Observable<QResultsModel> {
		return this._http.get<ProductModel[]>(`${balamir.API_URL}/product/list`).pipe(
			mergeMap(res => of(new QResultsModel(res)))
		);
	}

	getProductById(id:number): Observable<ProductModel> {
		return this._http.get<ProductModel>(`${balamir.API_URL}/product/my/${id}`);
	}

	storeProducts(products: ProductModel[] = []) {
		const taks$ = [];
		const length = products.length;

		for (let i = 0; i < length; i++) {
			taks$.push(this.storeProduct(products[i]));
		}

		return forkJoin(taks$);
	}

	/** Ürün Resimleri */
	getProductPhotos(productId: number): Observable<ProductPhotosModel[]> {
		return this._http.get<ProductPhotosModel[]>(`${balamir.API_URL}/product/photos/${productId}`);
	}

	removeProductPhoto(photoId: number): Observable<ProductPhotosModel> {
		return this._http.get<ProductPhotosModel>(`${balamir.API_URL}/product/photos/delete/${photoId}`);
	}

	/** Grup Servisleri */

	getProductCategories(qParams: QParamsModel): Observable<QResultsModel> {
		const params = this.httpUtils.getFindHTTPParams(qParams);
		return this._http.get<ProductCategoryModel[]>(`${balamir.API_URL}/product/categories?${params}`).pipe(
			mergeMap(res => of(new QResultsModel(res)))
		);
	}

	getProductCats(): Observable<ProductCategoryModel[]> {
		return this._http.get<ProductCategoryModel[]>(`${balamir.API_URL}/product/categories`);
	}

	storeProductCategory(category: ProductCategoryModel): Observable<ProductCategoryModel> {
		return this._http.post<ProductCategoryModel>(`${balamir.API_URL}/product/category/store`, category);
	}

	storeProductCategories(categories: ProductCategoryModel[] = []) {
		const taks$ = [];
		const length = categories.length;

		for (let i = 0; i < length; i++) {
			taks$.push(this.storeProductCategory(categories[i]));
		}

		return forkJoin(taks$);
	}

	/** Marka Servisleri */

	getProductBrands(): Observable<ProductBrandModel[]> {
		return this._http.get<ProductBrandModel[]>(`${balamir.API_URL}/product/brands`);
	}

	getProductBrandById(brandId: number): Observable<ProductBrandModel> {
		return this._http.get<ProductBrandModel>(`${balamir.API_URL}/product/brand/my/${brandId}`);
	}

	storeProductBrand(brand: ProductBrandModel): Observable<ProductBrandModel> {
		return this._http.post<ProductBrandModel>(`${balamir.API_URL}/product/brand/store`, brand);
	}

	/** Model Servisleri */

	getProductModelsByBrand(brandId: number): Observable<ProductModelModel[]> {
		return this._http.get<ProductModelModel[]>(`${balamir.API_URL}/product/model/brand/${brandId}`);
	}

	storeProductModel(model: ProductModelModel): Observable<ProductModelModel> {
		return this._http.post<ProductModelModel>(`${balamir.API_URL}/product/model/store`, model);
	}

}