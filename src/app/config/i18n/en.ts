// USA
export const locale = {
	lang: 'en',
	data: {
		TRANSLATOR: {
			SELECT: 'Select your language',
		},
		MENU: {
			NEW: 'new',
			ACTIONS: 'Actions',
			CREATE_POST: 'Create New Post',
			REPORTS: 'Reports',
			APPS: 'Apps',
			DASHBOARD: 'Dashboard'
		},
		TABLE: {
			BODY: {
				DATA_EMPTY: 'Kayıtlı veri bulunmuyor'
			},
			HEAD: {
				ID: 'Id',
				STATUS: 'Status',
				ACTIONS: 'Actions',
				DESC: 'Description',
			},
			FILTER: {
				ALL: 'Tümü',
				LABEL_FILTER: 'Filtrele',
				LABEL_STATUS: 'duruma göre'
			},
			SEARCH: {
				LABEL: 'Search...',
				LABEL_SEARCH: 'Search',
				LABEL_ALL: 'all fields'
			},
			SELECTION: {
				TOTAL: 'Total rows:',
				DELETE: 'All delete',
				DELETE_INFO: 'Seçilen verileri sil',
				VIEW: 'Görüntüle',
				VIEW_INFO: 'Seçilenleri görüntüle',
				UPDATE: 'Durum Güncelle',
				UPDATE_INFO: 'Seçilenlerin durumunu güncelle'
			},
			ACTIONS: {
				EDIT: 'Edit',
				DELETE: 'Delete',
				MORE: "More actions"
			},
			PAGINATION: {
				LABEL_PER_PAGE: 'Per Page',
				LABEL_PREV_PAGE: 'Önceki',
				LABEL_NEXT_PAGE: 'Sonraki',
				LABEL_FIRST_PAGE: 'İlk sayfa',
				LABEL_LAST_PAGE: 'Son sayfa'
			}
		},
		AUTH: {
			GENERAL: {
				OR: 'Or',
				SUBMIT_BUTTON: 'Submit',
				NO_ACCOUNT: 'Don\'t have an account?',
				SIGNUP_BUTTON: 'Signup',
				FORGOT_BUTTON: 'Forgot Password',
				BACK_BUTTON: 'Back',
				PRIVACY: 'Privacy',
				LEGAL: 'Legal',
				CONTACT: 'Contact',
			},
			LOGIN: {
				TITLE: 'Login',
				BUTTON: 'Sign In',
			},
			FORGOT: {
				TITLE: 'Forgotten Password?',
				DESC: 'Enter your email to reset your password',
			},
			REGISTER: {
				TITLE: 'Sign Up',
				DESC: 'Enter your details to create your account',
				SUCCESS: 'Your account has been successfuly registered. Please use your registered account to login.'
			},
			INPUT: {
				EMAIL: 'Email',
				FULLNAME: 'Fullname',
				PASSWORD: 'Password',
				CONFIRM_PASSWORD: 'Confirm Password',
			},
			VALIDATION: {
				INVALID: '{{name}} is not valid',
				REQUIRED: '{{name}} is required',
				MIN_LENGTH: '{{name}} minimum length is {{min}}',
				AGREEMENT_REQUIRED: 'Accepting terms & conditions are required',
				NOT_FOUND: 'The requested {{name}} is not found',
				INVALID_LOGIN: 'The login detail is incorrect'
			}
		},
		DASHBOARD: {
			TITLE: 'Dashboard'
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
