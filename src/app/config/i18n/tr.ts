// Türkçe
export const locale = {
	lang: 'tr',
	data: {
		BALAMIR: {
			NAME: 'TPanel',
			VERSION: '1.0.0',
			DIALOG: {
				FETCH_ENTITY_TITLE: 'Seçilen öğeler',
				SELECTED: 'Seçiniz',
				STATUS: 'Durum',
				STATUS_UPDATE: 'güncellenmesi için',
				GLOBAL: {
					UPDATE: 'Değişiklikler başarıyla kaydedildi',
					CREATE: 'Başarıyla kaydedildi.',
					STATUS: {
						CHANGE: 'Durum değiştir',
					},
				},
				DELETE: {
					TITLE: 'SİLME İŞLEMİ ONAYI',
					DESC: 'Silmek istediğinize emin misiniz?',
					DESC_ITEM: '{{name}}, verisini silmek istediğinize emin misiniz?',
					SUCCESS: 'Silme işlemi başarıyla gerçekleştirildi.',
					SUCCESS_ITEM: '{{name}}, adlı veri başarıyla silindi.',
					SUCCESS_ITEM_MULTI: '{{count}} veriler başarıyla silindi',
					MULTI_DESC: 'Veriler silinecek onaylıyor musunuz?',
					MULTI_DESC_COUNT: '{{count}} veriler silinecek. Onaylıyor musunuz?'
				},
				LOADING: {
					DELETE: 'Siliniyor, lütfen bekleyiniz...',
					DELETE_ITEM: '{{name}}, siliniyor, lütfen bekleyiniz...',
					DELETE_ITEM_MULTI: 'Veriler siliniyor, lütfen bekleyiniz...',
					DELETE_ITEM_MULTI_COUNT: '{{count}} veriler siliniyor, lütfen bekleyiniz...'
				}
			},
			STATUS: {
				ACTIVE: 'Aktif',
				DISABLE: 'Devre dışı'
			},
		},
		TRANSLATOR: {
			SELECT: 'Lütfen dil seçiniz',
		},
		MENU: {
			NEW: 'yeni',
			ACTIONS: 'İşlemler',
			CREATE_POST: 'Create New Post',
			REPORTS: 'Reports',
			APPS: 'Apps',
			DASHBOARD: 'Panel'
		},
		INPUT: {
			EMAIL: 'Email',
			EMAIL_PH: 'Email Adresiniz',
			PASSWORD: 'Şifre',
			PASSWORD_PH: 'Şifreniz'
		},
		BUTTON: {
			BACK: 'Geri',
			RESET: 'Sıfırla',
			CLOSE: 'Kapat',
			CANCEL: 'İptal',
			CANCEL_CHANGES: 'Değişiklikleri İptal et',
			DELETE: 'Sil',
			UPDATE: 'Güncelle',
			OK: 'Tamam',
			SAVE: 'Kaydet',
			SAVE_CHANGES: 'Değişiklikleri Kaydet',
			SAVE_CONTINUE: 'Kaydet & Devam et',
			SAVE_EXIT: 'Kaydet & Çık',
			SAVE_NEW_FORM: 'Kaydet & Yeni Form',
			INFO: {
				BACK: 'Geri dön',
				RESET_CHANGES: 'Değişiklikleri sıfırla',
				SAVE: 'Kaydet',
				SAVE_CONTINUE: 'Kaydet & Devam et',
				SAVE_EXIT: 'Kaydet & Çık'
			}
		},
		FORM: {
			REQUIRED: {
				ERROR: 'Lütfen gerekli alanları doldurunuz.',
			},
			INPUT: {
				REQUIRED: 'Gerekli',
				ENTER: 'Lütfen giriniz'
			}
		},
		TABLE: {
			BODY: {
				DATA_EMPTY: 'Kayıtlı veri bulunmuyor'
			},
			HEAD: {
				ID: 'Id',
				STATUS: 'Durum',
				ACTIONS: 'İşlemler',
				DESC: 'Açıklama',
			},
			FILTER: {
				ALL: 'Tümü',
				LABEL_FILTER: 'Filtrele',
				LABEL_STATUS: 'duruma göre',
				LABEL_GROUP: 'gruba göre'
			},
			SEARCH: {
				LABEL: 'Arama yap...',
				LABEL_SEARCH: 'Ara',
				LABEL_ALL: 'tüm alanlarda'
			},
			SELECTION: {
				TOTAL: 'Toplam seçilen veri:',
				DELETE: 'Seçilenleri sil',
				DELETE_INFO: 'Seçilen verileri sil',
				VIEW: 'Görüntüle',
				VIEW_INFO: 'Seçilenleri görüntüle',
				UPDATE: 'Durum Güncelle',
				UPDATE_INFO: 'Seçilenlerin durumunu güncelle'
			},
			ACTIONS: {
				EDIT: 'Düzenle',
				DELETE: 'Sil',
				MORE: "Diğer işlemler"
			},
			PAGINATION: {
				LABEL_PER_PAGE: 'Sayfa başına',
				LABEL_PREV_PAGE: 'Önceki',
				LABEL_NEXT_PAGE: 'Sonraki',
				LABEL_FIRST_PAGE: 'İlk sayfa',
				LABEL_LAST_PAGE: 'Son sayfa'
			}
		},
		AUTH: {
			GENERAL: {
				TITLE: 'TPanel Yönetim Sistemine Hoş Geldiniz.',
				DESC: 'İyi Çalışmalar!',
				OR: 'veya',
				SUBMIT_BUTTON: 'Gönder',
				NO_ACCOUNT: 'Hesabınız yok mu?',
				SIGNUP_BUTTON: 'Kayıt Ol',
				FORGOT_BUTTON: 'Şifremi Unuttum?',
				BACK_BUTTON: 'Geri',
			},
			LOGIN: {
				TITLE: 'Giriş Yap',
				BUTTON: 'Giriş',
			},
			FORGOT: {
				TITLE: 'Şifremi Unuttum?',
				DESC: 'Şifrenizi sıfırlamak için sistemde kayıtlı e-mail adresinizi giriniz',
			},
			REGISTER: {
				TITLE: 'Kaydol',
				DESC: 'Hesabınızı oluşturmak için bilgilerinizi girin',
				SUCCESS: 'Hesabınız başarıyla kaydedildi. Giriş yapmak için lütfen kayıtlı hesabınızı kullanın.'
			},
			INPUT: {
				EMAIL: 'Email',
				FULLNAME: 'Tam Adı',
				PASSWORD: 'Şifre',
				CONFIRM_PASSWORD: 'Şifre Tekrar',
			},
			VALIDATION: {
				INVALID: '{{name}} is not valid',
				REQUIRED: '{{name}} gerekli',
				MIN_LENGTH: '{{name}} minimum length is {{min}}',
				AGREEMENT_REQUIRED: 'Accepting terms & conditions are required',
				NOT_FOUND: 'The requested {{name}} is not found',
				INVALID_LOGIN: 'Giriş bilgileri hatalı'
			}
		},
		DASHBOARD: {
			TITLE: 'Panel'
		},
		CUSTOMER: {
			MENU: {
				TITLE: 'Müşteri Yönetimi',
				CUSTOMERS: 'Müşteriler',
				CREATE: 'Yeni Müşteri Oluştur',
				EDIT_ITEM: 'Düzenle - {{name}} {{sur_name}}',
				LIST: 'Müşteri Listesi',
				GROUPS: 'Müşteri Grupları',
				GROUPS_CREATE: 'Yeni Grup Oluştur',
				GROUPS_LIST: 'Grup Listesi'
			},
			BALAMIR: {
				STATUS_UPDATE: 'Müşterilerin durumlarını güncelleyin',
				STATUS_UPDATE_SUCCESS: 'Müşterilerin durumları başarıyla güncellendi',
				CREATE_ITEM: '{{name}} adlı müşteri başarıyla eklendi.',
				UPDATE_ITEM: '{{name}} adlı müşteri başarıyla güncellendi.',
				UPDATE_LOCATION: 'Adres bilgisi başarıyla güncellendi.',
				CREATE_LOCATION: 'Adres başarıyla eklendi.'
			},
			STATUS: {
				PENDING: 'Beklemede', // 0
				ACTIVE: 'Aktif', // 1
				SUSPENDED: 'Askı', // 9
				DELETE: 'Silinen' //-1
			},
			GROUPS: {
				GROUP_EDIT_ITEM: 'Grup Düzenle - {{name}}',
				STATUS_UPDATE: 'Grupların durumlarını güncelleyin',
				STATUS_UPDATE_SUCCESS: 'Grupların durumları başarıyla güncellendi',
				FORM: {
					GROUP_NAME: 'Grup Adı',
					STATUS: 'Durum',
					GROUP_DESC: 'Grup Açıklaması'
				},
				TAB: {
					GROUP_DETAILS: 'Grup Detayları',
					PRICE_SETTINGS: 'Fiyat Ayarları',
					OTHER_SETTINGS: 'Diğer Ayarlar'
				},
				CREATE_ITEM: '{{name}} adlı müşteri grubu başarıyla eklendi.',
				UPDATE_ITEM: '{{name}} adlı müşteri grubu başarıyla güncellendi.'
			},
			LOCATION: {
				TYPES: {
					BUSINESS: 'FİRMA',
					HOME: 'EV',
					BILLING: 'FATURA',
					SHIPPING: 'TESLİMAT',
					CONTRACT: 'SÖZLEŞME',
					RECIPIENT: 'İADE',
					OTHER: 'DİĞER'
				}
			}
		},
		PRODUCT: {
			MENU: {
				TITLE: 'Ürün Yönetimi',
				PRODUCTS: 'Ürünler',
				CREATE: 'Yeni Ürün Oluştur',
				LIST: 'Ürün Listesi',
			}
		},
		ECOMMERCE: {
			COMMON: {
				SELECTED_RECORDS_COUNT: 'Selected records count: ',
				ALL: 'All',
				SUSPENDED: 'Suspended',
				ACTIVE: 'Active',
				FILTER: 'Filter',
				BY_STATUS: 'by Status',
				BY_TYPE: 'by Type',
				BUSINESS: 'Business',
				INDIVIDUAL: 'Individual',
				SEARCH: 'Search',
				IN_ALL_FIELDS: 'in all fields'
			},
			ECOMMERCE: 'eCommerce',
			CUSTOMERS: {
				CUSTOMERS: 'Customers',
				CUSTOMERS_LIST: 'Customers list',
				NEW_CUSTOMER: 'New Customer',
				DELETE_CUSTOMER_SIMPLE: {
					TITLE: 'Customer Delete',
					DESCRIPTION: 'Are you sure to permanently delete this customer?',
					WAIT_DESCRIPTION: 'Customer is deleting...',
					MESSAGE: 'Customer has been deleted'
				},
				DELETE_CUSTOMER_MULTY: {
					TITLE: 'Customers Delete',
					DESCRIPTION: 'Are you sure to permanently delete selected customers?',
					WAIT_DESCRIPTION: 'Customers are deleting...',
					MESSAGE: 'Selected customers have been deleted'
				},
				UPDATE_STATUS: {
					TITLE: 'Status has been updated for selected customers',
					MESSAGE: 'Selected customers status have successfully been updated'
				},
				EDIT: {
					UPDATE_MESSAGE: 'Customer has been updated',
					ADD_MESSAGE: 'Customer has been created'
				}
			}
		}
	}
};
