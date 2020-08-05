var Router = Backbone.Router.extend({
	routes: {
		'': 'index',
		'shop': 'shop',
		'cart': 'cart',
		'thanks': 'thanks',
		'item/:id': 'item',
		//-----additional-----//
		'*404': 'index',
	},
	index: () => {
		var site = new Index();
		new Site().el.append(site.el);
	},
	shop: () => {
		var site = new Shop();
		new Site().el.append(site.el);
	},
	cart: () => {
		var site = new Cart();
		new Site().el.append(site.el);
	},
	item: (id) => {
		var site = new Item({_id: id});
		new Site().el.append(site.el);
	},
	thanks: () => {
		var site = new Thanks();
		new Site().el.append(site.el);
	},
	//-----new-----//
});


new Router;
Backbone.history.start({pushState: true});
