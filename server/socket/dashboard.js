var Users = require('./user');
var Items = require('./item');
var Shoppingcart = require('./shoppingcart');
var Orders = require('./order');
var Shippings = require('./shipping');
var Categories = require('./category');
var Stripe = require('./stripe');
var Btc = require('./btc');

module.exports = (socket) => {
	//-----Graph-----//
	socket.on('d.graph.users', (date) => {
		Users.graph(date, (data) => {
			socket.emit('d.graph.users', data);
		});
	});
	socket.on('d.graph.orders', (date) => {
		Orders.graph(date, (data) => {
			socket.emit('d.graph.orders', data);
		});
	});
	//-----Categories-----//
	socket.on('d.categories.get', () => {
		Categories.get({}, (data) => {
			socket.emit('d.categories.get', data);
		});
	});
	socket.on('d.categories.new', () => {
		Categories.new((Category) => {
			socket.emit('d.categories.new', Category);
		});
	});
	socket.on('d.category.change', (data) => {
		Categories.update(data._id, data, (Category) => {});
	});
	socket.on('d.category.remove', (id) => {
		Categories.remove(id, (Category) => {});
	});
	//-----Items-----//
	socket.on('d.items.get', () => {
		var skip = 0;
		Items.getAll({}, skip, (data) => {
			socket.emit('d.items.get', data);
		});
	});
	socket.on('d.items.new', () => {
		Items.new((Item) => {
			socket.emit('d.items.new', Item);
		});
	});
	socket.on('d.item.change', (data) => {
		Items.update(data._id, data, (Item) => {});
	});
	socket.on('d.item.remove', (id) => {
		Items.remove(id, (Item) => {});
	});
	//-----Orders-----//
	socket.on('d.orders.get', () => {
		Orders.get({finished: false}, (orders) => {
			socket.emit('d.orders.get', orders)
		});
	});
	socket.on('d.order.get', (id) => {
		Orders.getFull(id, (order) => {
			socket.emit('d.order.get', order);
		});
	});
	socket.on('d.order.check', (id) => {
		Orders.check(id);
	});
	//-----Customers-----//
	socket.on('d.customers.get', () => {
		Users.get({email: {$exists: true}}, (customers) => {
			socket.emit('d.customers.get', customers)
		});
	});
	socket.on('d.customer.select', (id) => {
		Users.get1({_id: id}, (User) => {
			User.set('selected', !User.get('selected'));
			User.save();
		});
	});
	socket.on('d.customer.orders', (id) => {
		Orders.get({user: id}, (orders) => {
			socket.emit('d.customer.orders', orders)
		});
	});
	//-----Shippings-----//
	socket.on('d.shippings.get', () => {
		Shippings.get({}, (data) => {
			socket.emit('d.shippings.get', data);
		});
	});
	socket.on('d.shippings.new', () => {
		Shippings.new((Shipping) => {
			socket.emit('d.shippings.new', Shipping);
		});
	});
	socket.on('d.shipping.change', (data) => {
		Shippings.update(data._id, data, (Shipping) => {});
	});
	socket.on('d.shipping.remove', (id) => {
		Shippings.remove(id, (Shipping) => {});
	});
};
