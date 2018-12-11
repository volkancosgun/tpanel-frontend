import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './customer.routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { CustomerGroupEditComponent } from './customer-group-edit/customer-group-edit.component';
import { CustomerGroupsComponent } from './customer-groups/customer-groups.component';
import { CustomerService } from './_services/customer.service';

import { LocationsEditComponent } from './_subs/locations/locations-edit/locations-edit.component';
import { LocationsListComponent } from './_subs/locations/locations-list/locations-list.component';
import { SettingsService } from '../settings/_services/settings.service';


@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		CustomerRoutingModule,
	],
	entryComponents: [
		LocationsEditComponent
	],
	declarations: [
		CustomerDashboardComponent,
		CustomerListComponent,
		CustomerEditComponent,
		CustomerGroupEditComponent,
		CustomerGroupsComponent,
		LocationsEditComponent,
		LocationsListComponent,
	],
	providers: [
		CustomerService,
		SettingsService
	]
})
export class CustomerModule { }
