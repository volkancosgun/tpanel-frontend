// tslint:disable-next-line:no-shadowed-variable
import { ConfigModel } from '../core/interfaces/config';

// tslint:disable-next-line:no-shadowed-variable
export class MenuConfig implements ConfigModel {
	public config: any = {};

	constructor() {
		this.config = {
			header: {
				self: {},
				items: [
					{
						title: 'İşlemler',
						root: true,
						icon: 'flaticon-add',
						toggle: 'click',
						translate: 'MENU.ACTIONS',
						submenu: {
							type: 'classic',
							alignment: 'left',
							items: [
								{
									title: 'Yeni Müşteri Oluştur',
									page: '/customer/creatse',
									icon: 'flaticon-user-add',
									translate: 'CUSTOMER.MENU.CREATE',
								},
								{
									title: 'Sipariş Yönetimi',
									icon: 'flaticon-business',
									submenu: {
										type: 'classic',
										alignment: 'right',
										bullet: 'line',
										items: [
											{
												title: 'Son Siparişler',
												page: '/',
												icon: '',
											},
											{
												title: 'Bekleyen Siparişler',
												page: '/',
												icon: '',
											},
											{
												title: 'İşlemdeki Siparişler',
												page: '/',
												icon: '',
											},
											{
												title: 'Onaylanmış Siparişler',
												page: '/',
												icon: '',
											},
											{
												title: 'İptal Edilen Siparişler',
												page: '/',
												icon: '',
											},
											{
												title: 'Ödemeler',
												page: '/',
												icon: '',
											}
										]
									}
								},
							]
						}
					},
				]
			},
			aside: {
				self: {},
				items: [
					{
						title: 'Panel',
						desc: 'Panel ana sayfası',
						root: true,
						icon: 'flaticon-line-graph',
						page: '/index',
						/* badge: { type: 'm-badge--danger', value: '2' }, */
						translate: 'MENU.DASHBOARD'
					},
					{ section: 'MODÜL' },
					{
						title: 'Müşteri Yönetimi',
						root: true,
						bullet: 'dot',
						icon: 'flaticon-users',
						translate: 'CUSTOMER.MENU.TITLE',
						submenu: [
							{
								title: 'Müşteriler',
								bullet: 'dot',
								translate: 'CUSTOMER.MENU.CUSTOMERS',
								submenu: [
									{
										title: 'Yeni Müşteri Oluştur',
										page: '/customer/create',
										translate: 'CUSTOMER.MENU.CREATE',
									},
									{
										title: 'Müşteri Listesi',
										page: '/customer/list',
										translate: 'CUSTOMER.MENU.LIST',
									},
								]
							},
							{
								title: 'Müşteri Grupları',
								bullet: 'dot',
								translate: 'CUSTOMER.MENU.GROUPS',
								submenu: [
									{
										title: 'Yeni Grup Oluştur',
										page: '/customer/group/create',
										translate: 'CUSTOMER.MENU.GROUPS_CREATE'
									},
									{
										title: 'Müşteri Grubu Listesi',
										page: '/customer/groups',
										translate: 'CUSTOMER.MENU.GROUPS_LIST'
									}
								]
							},
						]
					},
					{
						title: 'Ürün Yönetimi',
						root: true,
						bullet: 'dot',
						icon: 'flaticon-tabs',
						page: '/product',
						submenu: [
							{
								title: 'Ürünler',
								bullet: 'dot',
								page: '/product/list',
								submenu: [
									{
										title: 'Yeni Ürün Oluştur',
										page: '/product/create'
									},
									{
										title: 'Ürün Listesi',
										page: '/product/list'
									}
								]

							},
							{
								title: 'Kategoriler',
								bullet: 'dot',
								page: '/product/category/list',
							}
						]
					},

					/* {
						title: 'Ürün Yönetimi',
						root: true,
						bullet: 'dot',
						icon: 'flaticon-tabs',
						translate: 'PRODUCT.MENU.TITLE',
						submenu: [
							{
								title: 'Ürünler',
								bullet: 'dot',
								translate: 'PRODUCT.MENU.PRODUCTS',
								submenu: [
									{
										title: 'Yeni Ürün Oluştur',
										page: '/product/create',
										translate: 'PRODUCT.MENU.CREATE'
									},
									{
										title: 'Ürün Listesi',
										page: '/product/list',
										translate: 'PRODUCT.MENU.LIST'
									}
								]
							},
						]
					}, */
				]
			}
		};
	}
}
