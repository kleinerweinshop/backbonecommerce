var ObjectID = require('mongodb').ObjectID;
var DB = require('../database/order');

this.get = (by, callback) => {
	DB.get(by, (Orders) => {
		return callback(Orders);
	});
}

this.getFull = (id, callback) => {
	DB.getFull(id, (Order) => {
		return callback(Order);
	});
}

this.new = (User, Cart, payment, callback) => {
	var array = new Array;
	for (let entry of Cart) {
		array.push(ObjectID(entry.get('_id')));
		entry.item.set('amount', entry.item.get('amount')-entry.get('amount'));
		entry.item.save();
	}
	DB.new(User, array, payment, (Order) => {
		User.set('orders', User.get('orders')+1);
		return callback(Order);
	});
}

this.check = (id) => {
	DB.get({_id: id}, (order) => {
		Order = order[0];
		Order.set('checked', !Order.get('checked'));
		Order.save();
	});
}

this.graph = (date, callback) => {
	if (!date) return;
	DB.getId(date, (Orders) => {
		return callback(Orders);
	});
}
