var Router = Backbone.Router.extend({
	routes: {
		'dashboard/': 'login',
		'dashboard/index': 'index',
		'dashboard/categories': 'categories',
		'dashboard/category': 'categories',
		'dashboard/items': 'items',
		'dashboard/item': 'items',
		'dashboard/orders': 'orders',
		'dashboard/order': 'orders',
		'dashboard/customers': 'customers',
		'dashboard/shippings': 'shippings',
		'dashboard/shipping': 'shippings',
	},
	login: () => {
		var site = new Login();
		new Site().el.append(site.el);
	},
	index: () => {
		if (dashboard != true) return Backbone.history.navigate('dashboard/', true);
		var site = new Index();
		new Site().el.append(site.el);
	},
	categories: () => {
		if (dashboard != true) return Backbone.history.navigate('dashboard/', true);
		var site = new Categories();
		new Site().el.append(site.el);
	},
	items: () => {
		if (dashboard != true) return Backbone.history.navigate('dashboard/', true);
		var site = new Items();
		new Site().el.append(site.el);
	},
	orders: () => {
		if (dashboard != true) return Backbone.history.navigate('dashboard/', true);
		var site = new Orders();
		new Site().el.append(site.el);
	},
	customers: () => {
		if (dashboard != true) return Backbone.history.navigate('dashboard/', true);
		var site = new Customers();
		new Site().el.append(site.el);
	},
	shippings: () => {
		if (dashboard != true) return Backbone.history.navigate('dashboard/', true);
		var site = new Shippings();
		new Site().el.append(site.el);
	},
});

new Router;
Backbone.history.start({pushState: true});
