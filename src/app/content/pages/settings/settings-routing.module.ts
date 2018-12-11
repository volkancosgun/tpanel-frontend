import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SevdeskComponent } from './sevdesk/sevdesk.component';

const routes: Routes = [
	{ path: '', component: SevdeskComponent },
	{ path: 'sevdesk', component: SevdeskComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SettingRoutingModule { }