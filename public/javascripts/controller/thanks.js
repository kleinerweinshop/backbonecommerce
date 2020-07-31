var url = new URL(window.location);
var clientSecret = url.searchParams.get('payment_intent_client_secret');

var Thanks = Backbone.View.extend({
	id: 'thanks',
	initialize: function() {
		this.stripe();
		return this;
	},
	stripe: function() {
		var script = document.createElement('script');
    script.src = "https://js.stripe.com/v3/";
    document.getElementsByTagName('head')[0].appendChild(script);
		Socket.emit('payment.stripe');
		Socket.once('payment.stripe', (data) => {
			this.Stripe = Stripe(data.publishableKey);
			this.Stripe.retrievePaymentIntent(clientSecret).then(function(response) {
			  if (response.paymentIntent.status != 'succeeded') {
			    Backbone.history.navigate('', true);
					alert('Ihre Zahlung wurde nicht angenommen!');
			  } else if (response.paymentIntent && response.paymentIntent.status === 'succeeded') {
			    Socket.emit('payment.submit', response.paymentIntent);
					User.set('shoppingcart', 0);
					Backbone.history.navigate('', true);
					alert('Vielen Dank für Ihren Einkauf!');
			  }
			});
		});
	},
});
