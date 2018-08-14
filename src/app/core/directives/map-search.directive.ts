import { Directive, Output, EventEmitter, ElementRef, NgZone } from "@angular/core";
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';

declare var google: any;

@Directive({
    selector: 'input[mapsearch]',
})
export class MapSearchDirective {
    datas: any = [];
    @Output() onPlaceChange: EventEmitter<any> = new EventEmitter<any>();
    constructor(private el: ElementRef,
        private ngZone: NgZone,
        private mapsAPILoader: MapsAPILoader) {


        this.mapsAPILoader.load().then(() => {
            const autocomplete = new google.maps.places.Autocomplete(this.el.nativeElement);

            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    const place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    this.getAddressComponentByPlace(place);
                });
            });
        });
    }

    private getAddressComponentByPlace(place) {
        var components = place.address_components;
        var lat = place.geometry.location.lat();
        var lng = place.geometry.location.lng();
        this.datas.place_id = place.place_id;
        this.datas.address = place.formatted_address || null;
        this.datas.phone_format = place.formatted_phone_number || null;

        var country = null;
        var city = null;
        var postalCode = null;
        var street_number = null;
        var route = null;
        var locality = null;

        for (var i = 0, component; component = components[i]; i++) {
            if (component.types[0] == 'country') {
                country = component['short_name'] + ', ' + component['long_name'];
            }
            if (component.types[0] == 'administrative_area_level_1') {
                city = component['long_name'];
            }
            if (component.types[0] == 'postal_code') {
                postalCode = component['short_name'];
            }
            if (component.types[0] == 'street_number') {
                street_number = component['short_name'];
            }
            if (component.types[0] == 'route') {
                route = component['long_name'];
            }
            if (component.types[0] == 'locality') {
                locality = component['short_name'];
            }

        }

        this.datas.lat = lat;
        this.datas.lng = lng;
        this.datas.country = country;
        this.datas.city = city;
        this.datas.postal_code = postalCode;
        this.datas.street_number = street_number;
        this.datas.route = route;
        this.datas.locality = locality;

        this.onPlaceChange.emit(this.datas);

    }
}