var CreditcardView = Backbone.View.extend({
	template: _.template(document.getElementById('model-creditcard-template').innerHTML),
	initialize: function() {
		this.render();
		this.payment();
		return this;
	},
	render: function() {
		this.el.innerHTML = '';
		this.el.innerHTML = this.template();
		return this;
	},
	events: {
		'click button#creditcard': 'submit',
	},
	payment: function() {
		this.Stripe = this.model.get('stripe');
		this.card = this.model.get('card');
		this.card.mount('#card-element');
		this.card.on('change', (event) => {
			this.error(event);
		});
	},
	submit: function(e) {
		e.preventDefault();
		if (e.target.getAttribute('inactive') == 'true') return;
		e.target.setAttribute('inactive', true);
	  this.Stripe.confirmCardPayment(this.model.get('keys').clientSecret, {
	    payment_method: {
	      card: this.card,
				billing_details: {
	        name: User.get('firstname')+' '+User.get('lastname')
	      }
	    }
	  }).then((result) => {
			e.target.removeAttribute('inactive');
			if (result.error) return this.error(result);
	    if (result.paymentIntent.status === 'succeeded') {
				Socket.emit('payment.submit', result.paymentIntent);
				User.set('shoppingcart', 0);
				Backbone.history.navigate('', true);
				alert('Vielen Dank für Ihren Einkauf!');
			}
	  });
	},
	error: function(event) {
		var displayError = document.getElementById('card-errors');
		if (event.error) {
			displayError.textContent = event.error.message;
		} else {
			displayError.textContent = '';
		}
	}
});

var SepaView = Backbone.View.extend({
	template: _.template(document.getElementById('model-sepa-template').innerHTML),
	initialize: function() {
		this.render();
		this.payment();
		return this;
	},
	render: function() {
		this.el.innerHTML = '';
		this.el.innerHTML = this.template();
		return this;
	},
	events: {
		'click button#sepa': 'submit',
	},
	payment: function() {
		this.Stripe = this.model.get('stripe');
		this.sepa = this.model.get('sepa');
		this.sepa.mount('#iban-element');
	},
	submit: function(e) {
		e.preventDefault();
		if (e.target.getAttribute('inactive') == 'true') return;
		e.target.setAttribute('inactive', true);
	  this.Stripe.confirmIdealPayment(this.model.get('keys').clientSecret, {
	    payment_method: {
	      ideal: this.ideal,
				billing_details: {
	        name: User.get('firstname')+' '+User.get('lastname')
	      },
	    },
			return_url: window.location.origin+'/thanks',
	  }).then((result) => {
			e.target.removeAttribute('inactive');
			if (result.error) return console.log(result.error);
	  });
	},
});

var GiropayView = Backbone.View.extend({
	template: _.template(document.getElementById('model-giropay-template').innerHTML),
	initialize: function() {
		this.render();
		this.payment();
		return this;
	},
	render: function() {
		this.el.innerHTML = '';
		this.el.innerHTML = this.template();
		return this;
	},
	events: {
		'click img#giropay': 'submit',
	},
	payment: function() {
		this.Stripe = this.model.get('stripe');
	},
	submit: function(e) {
		e.preventDefault();
		if (e.target.getAttribute('inactive') == 'true') return;
		e.target.setAttribute('inactive', true);
	  this.Stripe.confirmGiropayPayment(this.model.get('keys').clientSecret, {
	    payment_method: {
	      billing_details: {
	        name: User.get('firstname')+' '+User.get('lastname')
	      }
	    },
			return_url: window.location.origin+'/thanks',
	  }).then((result) => {
			e.target.removeAttribute('inactive');
			if (result.error) return console.log(result.error);
	  });
	},
});

var BitcoinView = Backbone.View.extend({
	template: _.template(document.getElementById('model-bitcoin-template').innerHTML),
	initialize: function() {
		this.render();
		return this;
	},
	render: function() {
		this.el.innerHTML = '';
		this.el.innerHTML = this.template();
		this.el.querySelector('#crypto').href = this.model.get('hosted_url');
		return this;
	},
	events: {
		'click button#btc': 'submit',
	},
	submit: function(e) {
		if (e.target.getAttribute('inactive') == 'true') return;
		e.target.setAttribute('inactive', true);

	},
});
