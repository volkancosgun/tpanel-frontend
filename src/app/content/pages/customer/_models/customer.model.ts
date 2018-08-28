import { BaseModel } from "../../_balamir/models/_base.model";
import { CustomerLocationsModel } from "./customer-locations.model";

export class CustomerModel extends BaseModel {
	// Müşteri Cinsiyet
	gender: string;
	// Arama Adı
	_search: string;
	// Müşteri Id
	id: number;
	// Kullanıcı Id
	user_id: number;
	// Müşteri Grubu  Id
	group_id: number;
	// Müşteri Numarası
	customer_number: string;
	// Firma Adı (Ünvanı)
	business_name: string;
	// Firma Yöneticisi
	business_manager: string;
	// Müşteri Adı
	name: string;
	// Müşteri Soyadı
	sur_name: string;
	// Açıklama / Not
	description: string;
	// Müşteri E-mail
	email: string;
	// Telefon (Sabit)
	phone: string;
	// Telefon (Sabit/Alan Kodu)
	phone_code: string;
	// Telefon (Mobil)
	phone_mobil: string;
	// Telefon (Mobil/Alan Kodu)
	phone_mobil_code: string;
	// Fax
	fax: string;
	// Fax (Alan Kodu)
	fax_code: string;
	// Vergi
	tax: string;
	// Vergi Numarası
	tax_number: string;
	// IBAN Numarası
	iban: string;
	// BIC Numarası
	bic: string;
	// Sepa Numarası
	sepa: string;
	// Durum
	status: number;
	// Adresler
	_locations: CustomerLocationsModel[];
	__locations: any[];

	// Referanslar
	groupName: string;
	
	clear() {
		// Modeli Sıfırla
		this.gender = 'male';
		this._search = '';
		this.group_id = 1;
		this.name = '';
		this.sur_name = '';
		this.description = '';
		this.email = '';
		this.phone = '';
		this.phone_code = '+49';
		this.phone_mobil = '';
		this.phone_mobil_code = '+49';
		this.fax = '';
		this.fax_code = '+49';
		this.tax = '';
		this.tax_number = '';
		this.iban = '';
		this.bic = '';
		this.sepa = '';
		this.status = 1;

	}
}