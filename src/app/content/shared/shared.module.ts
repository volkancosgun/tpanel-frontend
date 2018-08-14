import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { MapSearchDirective } from '../../core/directives/map-search.directive';


@NgModule({
	imports: [
		CommonModule,
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyBpc-nqt0XbiSWyNWucoE3VtWHc9YBspeI',
			libraries: ["places"],
			language: 'de'
		})
	],
	declarations: [
		MapSearchDirective
	],
	exports: [
		CommonModule,
		AgmCoreModule,
		MapSearchDirective
	],
	providers: []
})
export class SharedModule { }