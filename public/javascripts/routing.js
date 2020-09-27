var Router = Backbone.Router.extend({
	routes: {
		'': 'index',
		'shop': 'category',
		'shop/:name': 'shop',
		'shoppingcart': 'shoppingcart',
		'thanks': 'thanks',
		'item/:id': 'item',
		'search/:term': 'search',
		//-----additional-----//
		'info': 'info',
		'privacy': 'privacy',
		'agb': 'agb',
		'imprint': 'imprint',
		'payment': 'payment',
		'*404': 'notfound',
	},
	index: () => {
		var site = new Index();
		new Site().el.append(site.el);
	},
	category: () => {
		var site = new Category();
		new Site().el.append(site.el);
	},
	shop: (id) => {
		var site = new Shop({search: id});
		new Site().el.append(site.el);
	},
	shoppingcart: () => {
		var site = new Shoppingcart();
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
	notfound: () => {
		const metaRobots = document.createElement('meta');
		metaRobots.name = 'robots';
		metaRobots.content = 'noindex';
		document.head.appendChild(metaRobots);
		var site = new Index();
		new Site().el.append(site.el);
	},
	//-----new-----//
	info: () => {
		var site = new Info();
		new Site().el.append(site.el);
	},
	privacy: () => {
		var site = new Privacy();
		new Site().el.append(site.el);
	},
	agb: () => {
		var site = new Agb();
		new Site().el.append(site.el);
	},
	imprint: () => {
		var site = new Imprint();
		new Site().el.append(site.el);
	},
	payment: () => {
		var site = new Footerpayment();
		new Site().el.append(site.el);
	},
});


new Router;
Backbone.history.start({pushState: true});
