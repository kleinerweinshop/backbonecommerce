var Shippings = Backbone.View.extend({
	id: 'shippings',
	template: _.template(document.getElementById('shippings-template').innerHTML),
	initialize: function() {
		this.render();
		this.getShipping((shippings) => {
			new ListView({
				el: this.el.querySelector('#shippings'),
				collection: shippings,
			});
		});
		return this;
	},
	render: function() {
		this.el.innerHTML = '';
		this.el.innerHTML = this.template();
		this.el.querySelector('#toshipping').setAttribute('active', true);
		return this;
	},
	events: {
		'click a#new': 'new',
	},
	getShipping: function(callback) {
		Socket.emit('d.shippings.get');
		Socket.once('d.shippings.get', (data) => {
			var collection = new Backbone.Collection;
			for (let entry of data) {
				var model = new ShippingModel(entry);
				collection.add(model);
			}
			return callback(collection);
		});
	},
	new: function() {
		Socket.emit('d.shippings.new');
		Socket.once('d.shippings.new', (data) => {
			var model = new ShippingModel(data);
			var site = new Shipping({
				model: model,
			});
			new Site().el.append(site.el);
		});
	}
});

var Shipping = Backbone.View.extend({
	id: 'shipping',
	template: _.template(document.getElementById('shipping-template').innerHTML),
	initialize: function() {
		this.render();
		return this;
	},
	render: function() {
		this.el.innerHTML = '';
		this.el.innerHTML = this.template(this.model.attributes);
		this.el.querySelector('#toshipping').setAttribute('active', true);
		Backbone.history.navigate('dashboard/shipping', false);
		return this;
	},
	events: {
		'change input#input': 'input',
		'click button#send': 'send',
		'click button#remove': 'delete',
	},
	input: function(e) {
		this.model.set(e.target.name, e.target.value);
	},
	send: function() {
		Socket.emit('d.shipping.change', this.model.attributes);
		var site = new Shippings();
		new Site().el.append(site.el);
	},
	delete: function() {
		if (!confirm('Do you want to delete this?')) return;
		Socket.emit('d.shipping.remove', this.model.get('_id'));
		var site = new Shippings();
		new Site().el.append(site.el);
	}
});
