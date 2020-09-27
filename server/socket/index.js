var ObjectID = require('mongodb').ObjectID;
var Users = require('./user');
var Items = require('./item');
var Shoppingcart = require('./shoppingcart');
var Orders = require('./order');
var Shipping = require('./shipping');
var Categories = require('./category');
var Stripe = require('./stripe');
var Btc = require('./btc');

module.exports = (io) => {
	io.on('connection', function (socket) {
		var User;
		socket.on('dashboard', (data) => {
			if (!Users.dashboard(data)) return socket.emit('dashboard', false);
			require('./dashboard')(socket);
			return socket.emit('dashboard', true);
		});
		//-----Categories-----//
		socket.on('categories.get', () => {
			Categories.get({}, (data) => {
				socket.emit('categories.get', data);
			});
		});
		//-----Items-----//
		socket.on('items.get', (data) => {
			var skip = 0;
			Items.get(data, skip, (data) => {
				socket.emit('items.get', data);
			});
		});
		socket.on('item.get', (id) => {
			Items.getOne(id, (data) => {
				socket.emit('item.get', data);
			});
		});
		socket.once('session', (data) => {
			Users.session(data, (User) => {
				socket.on('void', () => {
					socket.emit('void');
				});
				//-----User-----//
				User.set('socket', socket.id);
				socket.emit('user', User);
				socket.on('user.set', (data) => {
					var key = Object.keys(data)[0];
					User.set(key, data[key]);
					User.save();
				});
				//-----Shoppingcart-----//
				socket.on('shoppingcart.get', () => {
					Shoppingcart.get({
						user: User.get('_id'),
					}, (data) => {
						socket.emit('shoppingcart.get', data);
					});
				});
				socket.on('shoppingcart.add', (id) => {
					Shoppingcart.new(User, id);
				});
				socket.on('shoppingcart.remove', (id) => {
					Shoppingcart.remove(User, {_id: id});
				});
				socket.on('shoppingcart.amount', (data) => {
					Shoppingcart.get({_id: data._id}, (entry) => {
						if (data.amount > entry[0].item.get('amount')) return;
						entry[0].set('amount', data.amount);
						entry[0].save();
					});
				});
				//-----Shipping-----//
				socket.on('shipping.get', (data) => {
					Shipping.get({maxweight: {$gte: data}}, (shipping) => {
						socket.emit('shipping.get', shipping[0]);
					});
				});
				//-----Payment-----//
				var Payment;
				socket.on('payment.stripe', () => {
					Shoppingcart.get({
						user: User.get('_id'),
					}, (shoppingcart) => {
						Shipping.calculate(shoppingcart, (total) => {
							Stripe.pay(total, (payment) => {
								Payment = payment;
								socket.emit('payment.stripe', {
									publishableKey: _Payment.stripe_publickey,
									clientSecret: Payment.client_secret
								});
							});
						});
					});
				});
				socket.on('payment.submit', (data) => {
					if (!data) return;
					var Payment = data;
					Stripe.validate(Payment.id, (err) => {
						if (err) return console.error(err);
						Orders.new(User.get('_id'), Payment.id, (Order) => {
							Orders.mail(User, Order);
							Shoppingcart.empty(User);
							User.set('orders', User.get('orders')+1);
						});
					});
				});
				socket.on('payment.btc', () => {
					Shoppingcart.get({
						user: User.get('_id'),
						finished: false,
					}, (shoppingcart) => {
						Shipping.calculate(shoppingcart, (total) => {
							if (total <= 0) return;
							Btc.pay(User, total, (payment) => {
								Payment = payment;
								socket.emit('payment.btc', payment);
							});
						});
					});
				});

			});
		});
	});
};
