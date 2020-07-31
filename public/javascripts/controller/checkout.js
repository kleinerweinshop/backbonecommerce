var Checkout = Backbone.View.extend({
	id: 'checkout',
	template: _.template(document.getElementById('checkout-template').innerHTML),
	initialize: function() {
		Backbone.history.navigate('checkout', false);
		this.render();
		this.stripe();
		return this;
	},
	render: function() {
		this.el.innerHTML = '';
		this.el.innerHTML = this.template({
			user: User.attributes,
			shoppingcart: this.collection,
		});
		return this;
	},
	events: {
		'click #navi': 'navi',
		'click a#toshipping': 'shipping',
		'click #methods span': 'method',
		'click span.creditcard': 'creditcard',
		'click span.ideal': 'ideal',
		'click span.giropay': 'giropay',
	},
	navi: function() {
		var el = this.el.querySelector('.navi');
		if (el.style.display == 'grid') return el.style.display = 'none';
		else return el.style.display = 'grid';
	},
	shipping: function() {
		var site = new Shipping({
			collection: this.collection,
		});
		new Site().el.append(site.el);
	},
	method: function(e) {
		for (let el of this.el.querySelector('#methods').children) {
			el.removeAttribute('active');
		}
		e.target.setAttribute('active', true);
	},
	creditcard: function() {
		new CreditcardView({
			el: this.el.querySelector('#payment'),
			model: this.model,
		});
	},
	ideal: function() {
		new IdealView({
			el: this.el.querySelector('#payment'),
			model: this.model,
		});
	},
	giropay: function() {
		new GiropayView({
			el: this.el.querySelector('#payment'),
			model: this.model,
		});
	},
	stripe: function() {
    var script = document.createElement('script');
    script.src = "https://js.stripe.com/v3/";
    document.getElementsByTagName('head')[0].appendChild(script);
		Socket.emit('payment.stripe');
		Socket.once('payment.stripe', (data) => {
			var stripe = Stripe(data.publishableKey)
			this.model = new Backbone.Model({
				keys: data,
				stripe: stripe,
				card: stripe.elements().create('card', {
					hidePostalCode: true,
					style: {
						base: {
							color: '#555',
							fontSize: '18px',
						}
					},
				}),
				ideal: stripe.elements().create('idealBank', {
					style: {
						base: {
							color: '#555',
							fontSize: '18px',
						}
					},
				}),
			});
			this.creditcard();
		});
	}
});
