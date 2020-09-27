var UserModel = Backbone.Model.extend({
	template: _.template(document.getElementById('model-user-template').innerHTML),
	defaults: {
		firstname: '',
		lastname: '',
		email: '',
		street: '',
		town: '',
		zip: '',
		country: 'Germany',
		shoppingcart: 0,
		selected: false,
	},
  open: function() {
    var site = new Customer({
      model: this,
    });
		new Site().el.append(site.el);
  },
	select: function() {
		this.set('selected', !this.get('selected'));
		Socket.emit('d.customer.select', this.get('_id'));
	},
});

var CategoryModel = Backbone.Model.extend({
	template: _.template(document.getElementById('model-category-template').innerHTML),
	defaults: {
		name: '',
		image: '',
		order: 0,
		desc: '',
		amount: 0,
	},
	open: function() {
    var site = new Category({
      model: this,
    });
		new Site().el.append(site.el);
  },
});

var ItemModel = Backbone.Model.extend({
	template: _.template(document.getElementById('model-item-template').innerHTML),
	initialize: function() {
		this.on('change:category', this.change);
	},
	defaults: {
		name: '',
		category: null,
		image: '',
		info: '',
		tags: [],
		price: 0,
		liter: 0,
	},
	open: function() {
    var site = new Item({
      model: this,
    });
		new Site().el.append(site.el);
  },
	change: function(e) {
		if (e.changed.category === '') return this.set('category', null);
	}
});

var OrderModel = Backbone.Model.extend({
	template: _.template(document.getElementById('model-order-template').innerHTML),
	defaults: {
		shoppingcart: [],
		user: {},
		checked: false,
		finished: false,
		date: new Date(),
	},
	open: function() {
    var site = new Order({
      model: this,
    });
		new Site().el.append(site.el);
  },
});

var ShippingModel = Backbone.Model.extend({
	template: _.template(document.getElementById('model-shipping-template').innerHTML),
	defaults: {
		type: '',
		maxweight: 0,
		maxlength: 0,
		maxwidth: 0,
		maxheight: 0,
		price: 0,
	},
	open: function() {
    var site = new Shipping({
      model: this,
    });
		new Site().el.append(site.el);
  },
});
