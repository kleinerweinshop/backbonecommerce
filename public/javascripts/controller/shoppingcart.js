var Shoppingcart = Backbone.View.extend({
	id: 'shoppingcart',
	template: _.template(document.getElementById('shoppingcart-template').innerHTML),
	initialize: function() {
		this.render();
		new ShoppingcartCollection().getData((data) => {
			User.set('shoppingcart', data);
			this.collection = data;
			this.listenTo(this.collection, 'change', this.setTotal);
			this.listenTo(this.collection, 'remove', this.setTotal);
			new ShoppingcartView({
				el: this.el.querySelector('#items'),
				collection: this.collection,
			});
			this.setTotal();
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
		'click button#next': 'next',
	},
	navi: function() {
		var el = this.el.querySelector('.navi');
		if (el.style.display == 'grid') return el.style.display = 'none';
		else return el.style.display = 'grid';
	},
	setTotal: function() {
		this.el.querySelector('#totalprice').innerText = this.collection.total()+' €';
	},
	next: function() {
		User.check((err) => {
			if (err) return this.shipping();
			else return this.checkout();
		});
	},
	shipping: function() {
		var site = new Shipping({
			collection: this.collection,
		});
		new Site().el.append(site.el);
	},
	checkout: function() {
		var site = new Checkout({
			collection: this.collection,
		});
		new Site().el.append(site.el);
	},
});
