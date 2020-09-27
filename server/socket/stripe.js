const stripe = require('stripe')(_Payment.stripe_secretkey);

this.pay = async (total, callback) => {
	const paymentIntent = await stripe.paymentIntents.create({
	  amount: total,
	  currency: _Payment.currency,
		payment_method_types: _Payment.methods,
	  metadata: {
			shippingcost: 'accept_a_payment',
		},
	});
	return callback(paymentIntent);
}

this.validate = async (id, callback) => {
	console.log('stripe validate mit promise für error bzw id checken');
	const intent = await stripe.paymentIntents.retrieve(id);
	if (intent.status === 'succeeded') return callback();
	else return callback(intent.status);
}

this.update = () => {

}
