import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { ProductService } from './_services/product.service';

import { ProductListComponent } from './product-list/product-list.component';
import { ProductCategoryListComponent } from './product-category-list/product-category-list.component';
import { ProductCategoryEditDialogComponent } from './product-category-edit-dialog/product-category-edit-dialog.component';
import { AlertComponent } from '../_balamir/shared/alert/alert.component';
import { LayoutUtilsService } from '../_balamir/utils/layout-utils.service';
import { ActionNotificationComponent } from '../_balamir/shared/action-natification/action-notification.component';
import { HttpUtilsService } from '../_balamir/utils/http-utils.service';
import { DeleteEntityDialogComponent } from '../_balamir/shared/delete-entity-dialog/delete-entity-dialog.component';
import { FetchEntityDialogComponent } from '../_balamir/shared/fetch-entity-dialog/fetch-entity-dialog.component';
import { TypesUtilsService } from '../_balamir/utils/types-utils.service';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductEditImageComponent } from './_subs/product-edit-image/product-edit-image.component';
import { NgxUploaderModule } from 'ngx-uploader';
import { GalleryModule, GalleryConfig } from  '@ngx-gallery/core';
import { GallerizeModule } from  '@ngx-gallery/gallerize';
import { LightboxModule } from  '@ngx-gallery/lightbox';
import { ProductBrandListComponent } from './product-brand-list/product-brand-list.component';
import { ProductBrandEditDialogComponent } from './product-brand-edit-dialog/product-brand-edit-dialog.component';
import { ProductModelListComponent } from './product-model-list/product-model-list.component';
import { ProductModelEditDialogComponent } from './product-model-edit-dialog/product-model-edit-dialog.component';

const config: GalleryConfig = {
	autoPlay: false,
	thumb: true,
	dots: true,
	loadingStrategy: 'lazy'
  };

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		ProductRoutingModule,
		NgxUploaderModule,
		GalleryModule.forRoot(config),
		LightboxModule.forRoot({
			panelClass: 'fullscreen'
		  }),
		GallerizeModule
	],
	entryComponents: [
		ProductCategoryEditDialogComponent,
		ProductBrandEditDialogComponent,
		ProductModelEditDialogComponent
	],
	declarations: [
		ProductListComponent,
		ProductCategoryListComponent,
		ProductCategoryEditDialogComponent,
		ProductEditComponent,
		ProductEditImageComponent,
		ProductBrandListComponent,
		ProductBrandEditDialogComponent,
		ProductModelListComponent,
		ProductModelEditDialogComponent
	],
	providers: [
		ProductService,
	]
})
export class ProductModule { }