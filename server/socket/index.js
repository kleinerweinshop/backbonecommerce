var Users = require('./user');
var Items = require('./item');
var Shoppingcart = require('./shoppingcart');
var Orders = require('./order');
var Stripe = require('./stripe');

module.exports = (io) => {
	io.on('connection', function (socket) {
		_Traffic++;
		socket.once('session', (data) => {
			Users.session(data, (User) => {
				socket.on('dashboard', (data) => {
					if (!Users.dashboard(data)) return socket.emit('dashboard', false);
					require('./dashboard')(socket);
					return socket.emit('dashboard', true);
				});
				//-----User-----//
				User.set('socket', socket.id);
				socket.emit('user', User);
				socket.on('user.set', (data) => {
					var key = Object.keys(data)[0];
					User.set(key, data[key]);
					User.save();
				});
				//-----Items-----//
				socket.on('items.get', () => {
					Items.get({}, (data) => {
						socket.emit('items.get', data);
					});
				});
				socket.on('item.get', (id) => {
					Items.get({_id: id}, (data) => {
						socket.emit('item.get', data[0]);
					});
				});
				//-----Shoppingcart-----//
				socket.on('shoppingcart.get', (id) => {
					Shoppingcart.get({
						user: User.get('_id'),
						finished: false,
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
						entry[0].set('amount', data.amount);
						entry[0].save();
					});
				});
				//-----Payment-----//
				var Payment;
				socket.on('payment.stripe', () => {
					Shoppingcart.get({
						user: User.get('_id'),
						finished: false,
					}, (shoppingcart) => {
						Stripe.pay(shoppingcart, (payment) => {
							Payment = payment;
							socket.emit('payment.stripe', {
								publishableKey: _Config.stripe_publickey,
								clientSecret: Payment.client_secret
							});
						});
					});
				});
				socket.on('payment.submit', (data) => {
					if (!Payment) return;
					if (data) Payment = data;
					Stripe.check(Payment.id, (err) => {
						if (err) return console.error(err);
						Shoppingcart.get({
							user: User.get('_id'),
							finished: false,
						}, (shoppingcart) => {
							Orders.new(User, shoppingcart, Payment.id, (Order) => {
								Shoppingcart.empty(User, shoppingcart);
							});
						});
					});
				});
			});
		});
	});
};
