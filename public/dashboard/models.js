var ItemModel = Backbone.Model.extend({
	template: _.template(document.getElementById('model-item-template').innerHTML),
	defaults: {
		name: '',
		image: '',
		info: '',
		attributes: [],
		price: 0,
	},
	open: function() {
    var site = new Item({
      model: this,
    });
		new Site().el.append(site.el);
  },
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
