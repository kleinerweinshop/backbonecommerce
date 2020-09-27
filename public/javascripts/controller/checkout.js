var Checkout = Backbone.View.extend({
	id: 'checkout',
	template: _.template(document.getElementById('checkout-template').innerHTML),
	initialize: function() {
		Backbone.history.navigate('checkout', false);
		this.getShipping((shipping) => {
			this.render(shipping);
			this.stripe();
			this.btc();
		});
		return this;
	},
	render: function(shipping) {
		this.el.innerHTML = '';
		this.el.innerHTML = this.template({
			user: User.attributes,
			shoppingcart: this.collection,
			shipping: shipping,
		});
		return this;
	},
	events: {
		'click #back': () => Backbone.history.navigate('shoppingcart', true),
		'click #navi': 'navi',
		'click a#toshipping': 'toshipping',
		'click #methods span': 'method',
		'click span.creditcard': 'creditcard',
		'click span.sepa': 'sepa',
		'click span.giropay': 'giropay',
		'click span.btc': 'bitcoin',
	},
	navi: function() {
		var el = this.el.querySelector('.navi');
		if (el.style.display == 'grid') return el.style.display = 'none';
		else return el.style.display = 'grid';
	},
	getShipping: function(callback) {
		var weight = 0;
		this.collection.each((model) => {
			weight += model.get('amount')*model.get('item').weight;
		});
		Socket.emit('shipping.get', weight);
		Socket.once('shipping.get', (data) => {
			if (!data) data = {price: 0};
			return callback(data);
		});
	},
	toshipping: function() {
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
			model: this.Stripe,
		});
	},
	sepa: function() {
		new SepaView({
			el: this.el.querySelector('#payment'),
			model: this.Stripe,
		});
	},
	giropay: function() {
		new GiropayView({
			el: this.el.querySelector('#payment'),
			model: this.Stripe,
		});
	},
	bitcoin: function() {
		new BitcoinView({
			el: this.el.querySelector('#payment'),
			model: this.Btc,
		});
	},
	stripe: function() {
    var script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    document.getElementsByTagName('head')[0].appendChild(script);
		Socket.emit('payment.stripe');
		Socket.once('payment.stripe', (data) => {
			var stripe = Stripe(data.publishableKey)
			this.Stripe = new Backbone.Model({
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
				sepa: stripe.elements().create('iban', {
					supportedCountries: ['SEPA'],
					placeholderCountry: 'DE',
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
	},
	btc: function() {
    var script = document.createElement('script');
    script.src = 'https://commerce.coinbase.com/v1/checkout.js';
    document.getElementsByTagName('head')[0].appendChild(script);
		Socket.emit('payment.btc');
		Socket.once('payment.btc', (data) => {
			this.Btc = new Backbone.Model(data);
		});
	},
});
