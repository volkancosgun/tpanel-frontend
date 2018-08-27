import { Component, OnInit, EventEmitter, Input, ViewChild } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { Gallery, GalleryRef } from '@ngx-gallery/core';
import { balamir } from '../../../../../../environments/balamir';
import { ProductService } from '../../_services/product.service';
import { ProductPhotosModel } from '../../_models/product-photos.model';
import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsService, MessageType } from '../../../_balamir/utils/layout-utils.service';

@Component({
  selector: 'm-product-edit-image',
  templateUrl: './product-edit-image.component.html',
  styleUrls: ['./product-edit-image.component.scss']
})

export class ProductEditImageComponent implements OnInit {
  @Input() productId: number = null;
  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  baseUrl = 'http://localhost:8000';
  photos: ProductPhotosModel[];
  appDomain = balamir.APP_DOMAIN;

  // resim galerisi
  galleryId = 'productGallery';


  constructor(
    private productService: ProductService,
    private gallery: Gallery,
    private translate: TranslateService,
    private layoutUtilsService: LayoutUtilsService
  ) {
    this.options = { concurrency: 1, maxUploads: 5 };
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>(); 
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {

    this.loadPhotos();
  }

  removePhoto(data) {

		const _title: string = this.translate.instant('BALAMIR.DIALOG.DELETE.TITLE');
		const _desc: string = this.translate.instant('BALAMIR.DIALOG.DELETE.DESC');
		const _waitDesc: string = this.translate.instant('BALAMIR.DIALOG.LOADING.DELETE');
		const _deleteMessage: string = this.translate.instant('BALAMIR.DIALOG.DELETE.SUCCESS');

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _desc, _waitDesc);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
      }
      
      this.productService.removeProductPhoto(data.id).subscribe(res => {
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
        this.loadPhotos();
      });
		});


  }

  loadPhotos() {
    const galleryRef: GalleryRef = this.gallery.ref(this.galleryId);
    this.productService.getProductPhotos(this.productId).subscribe((res: ProductPhotosModel[]) => {
      this.photos = res;
      galleryRef.reset();
      this.photos.forEach(element => {
        galleryRef.addImage({
          src: `${balamir.APP_DOMAIN}/uploads/${element.photo}`,
          thumb: `${balamir.APP_DOMAIN}/uploads/${element.photo}`,
          id: element.id
        });
      });
      
    });
  }

  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') { 
      console.log('allAddedToQueue');
      const event: UploadInput = {
        type: 'uploadAll',
        url: `${balamir.API_URL}/product/uploadImage`,
        method: 'POST',
        data: { id: `${this.productId}` }
      };
      this.uploadInput.emit(event);
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') { 
      this.files.push(output.file);
      console.log('addedToQueue');
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
      console.log('uploading');
    } else if (output.type === 'removed') {
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
      console.log('removed');
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
      console.log('dragOver');
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
      console.log('dragOut');
    } else if (output.type === 'drop') {
      this.dragOver = false;
      console.log('drop');
    } else if(output.type === 'done') {
      this.loadPhotos();
    }
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }

}