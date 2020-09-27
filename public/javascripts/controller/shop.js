var Category = Backbone.View.extend({
	id: 'shop',
	template: _.template(document.getElementById('shop-template').innerHTML),
	initialize: function() {
		this.getCategories((categories) => {
			this.render();
			new CategoriesView({
				el: this.el.querySelector('#items'),
				collection: categories,
			});
		});
		return this;
	},
	render: function() {
		this.el.innerHTML = '';
		this.el.innerHTML = this.template();
		return this;
	},
	events: {
		'click #back': () => Backbone.history.navigate('', true),
		'click #navi': 'navi',
		'keydown #search': 'enter',
		'click i#find': 'search',
	},
	navi: function() {
		var el = this.el.querySelector('.navi');
		if (el.style.display == 'grid') return el.style.display = 'none';
		else return el.style.display = 'grid';
	},
	enter: function(e) {
		if (e.keyCode != 13) return;
		else this.search();
	},
	search: function() {
		Backbone.history.navigate('search', false);
		var el = this.el.querySelector('#search');
		var site = new Shop({search: el.value});
		new Site().el.append(site.el);
	},
	getCategories: function(callback) {
		Socket.emit('categories.get');
		Socket.once('categories.get', (data) => {
			var categories = new Backbone.Collection;
			for (let entry of data) {
				var model = new CategoryModel(entry);
				categories.add(model);
			}
			return callback(categories);
		});
	},
});

var Shop = Backbone.View.extend({
	id: 'shop',
	template: _.template(document.getElementById('shop-template').innerHTML),
	initialize: function(e) {
		this.getItems(e.search, (items) => {
			this.render();
			new ItemsView({
				el: this.el.querySelector('#items'),
				collection: items,
			});
		});
		return this;
	},
	render: function() {
		this.el.innerHTML = '';
		this.el.innerHTML = this.template();
		return this;
	},
	events: {
		'click #back': () => Backbone.history.navigate('shop', true),
		'click #navi': 'navi',
		'keydown #search': 'enter',
		'click i#find': 'search',
	},
	navi: function() {
		var el = this.el.querySelector('.navi');
		if (el.style.display == 'grid') return el.style.display = 'none';
		else return el.style.display = 'grid';
	},
	enter: function(e) {
		if (e.keyCode != 13) return;
		else this.search();
	},
	search: function() {
		var el = this.el.querySelector('#search');
		this.getItems(el.value, (items) => {
			this.render();
			new ItemsView({
				el: this.el.querySelector('#items'),
				collection: items,
			});
		});
	},
	getItems: function(data, callback) {
		Socket.emit('items.get', data);
		Socket.once('items.get', (data) => {
			var items = new Backbone.Collection;
			for (let entry of data) {
				var model = new ItemModel(entry);
				items.add(model);
			}
			return callback(items);
		});
	},
});
