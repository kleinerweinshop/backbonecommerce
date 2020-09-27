var Customers = Backbone.View.extend({
	id: 'customers',
	template: _.template(document.getElementById('customers-template').innerHTML),
	initialize: function() {
		this.render();
		this.getCustomers((customers) => {
			new ListView({
				el: this.el.querySelector('#customers'),
				collection: customers,
			});
		});
		return this;
	},
	render: function() {
		this.el.innerHTML = '';
		this.el.innerHTML = this.template();
		this.el.querySelector('#tocustomers').setAttribute('active', true);
		return this;
	},
	events: {
	},
	getCustomers: function(callback) {
		Socket.emit('d.customers.get');
		Socket.once('d.customers.get', (data) => {
			var collection = new Backbone.Collection;
			for (let entry of data) {
				var model = new UserModel(entry);
				collection.add(model);
			}
			return callback(collection);
		});
	},
});

var Customer = Backbone.View.extend({
	id: 'customer',
	template: _.template(document.getElementById('customer-template').innerHTML),
	initialize: function() {
		this.render();
		this.getOrders((orders) => {
			new ListView({
				el: this.el.querySelector('#orders'),
				collection: orders,
			});
		});
		return this;
	},
	render: function() {
		this.el.innerHTML = '';
		this.el.innerHTML = this.template();
		this.el.querySelector('#tocustomers').setAttribute('active', true);
		Backbone.history.navigate('dashboard/customer', false);
		return this;
	},
	events: {
		'click button#check': 'check',
	},
	getOrders: function(callback) {
		Socket.emit('d.customer.orders', this.model.get('_id'));
		Socket.once('d.customer.orders', (data) => {
			var orders = new Backbone.Collection;
			for (let entry of data) {
				var model = new OrderModel(entry);
				orders.add(model);
			}
			return callback(orders);
		});
	},
	check: function(e) {
		if (e.target.getAttribute('inactive') == 'true') return;
    e.target.setAttribute('inactive', true);
		Socket.emit('d.order.check', this.model.get('_id'));
	}
});
