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
		this.card.on('change', function(event) {
			var displayError = document.getElementById('card-errors');
			if (event.error) {
				displayError.textContent = event.error.message;
			} else {
				displayError.textContent = '';
			}
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
			if (result.error) return console.log(result.error);
	    if (result.paymentIntent.status === 'succeeded') {
				Socket.emit('payment.submit');
				User.set('shoppingcart', 0);
				Backbone.history.navigate('', true);
				alert('Vielen Dank für Ihren Einkauf!');
			}
	  });
	}
});

var IdealView = Backbone.View.extend({
	template: _.template(document.getElementById('model-ideal-template').innerHTML),
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
		'click button#ideal': 'submit',
	},
	payment: function() {
		this.Stripe = this.model.get('stripe');
		this.ideal = this.model.get('ideal');
		console.log(this.model.attributes);
		this.ideal.mount('#ideal-bank-element');
	},
	submit: function(e) {
		e.preventDefault();
		if (e.target.getAttribute('inactive') == 'true') return;
		e.target.setAttribute('inactive', true);
	  this.Stripe.confirmIdealPayment(this.model.get('keys').clientSecret, {
	    payment_method: {
	      ideal: this.ideal,
				billing_details: {
	        name: this.model.get('firstname')+' '+this.model.get('lastname')
	      },
	    },
			return_url: 'https://'+window.location.hostname+'/thanks',
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
	        name: this.model.get('firstname')+' '+this.model.get('lastname')
	      }
	    },
			return_url: 'https://'+window.location.hostname+'/thanks',
	  }).then((result) => {
			e.target.removeAttribute('inactive');
			if (result.error) return console.log(result.error);
	  });
	},
});
