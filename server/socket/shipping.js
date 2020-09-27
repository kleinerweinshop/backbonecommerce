var ObjectID = require('mongodb').ObjectID;
var DB = require('../database/shipping');

this.get = (by, callback) => {
	DB.get(by, (Shippings) => {
		return callback(Shippings);
	});
}

this.new = (callback) => {
	DB.new((Shipping) => {
		return callback(Shipping);
	});
}

this.update = (id, data, callback) => {
	DB.update(id, data, (Shipping) => {
		return callback(Shipping);
	});
}

this.remove = (id, callback) => {
	DB.remove(id, (Shipping) => {
		return callback(Shipping);
	});
}

this.calculate = (Shoppingcart, callback) => {
	var total = 0;
	var weight = 0;
	var shipping = 0;
	for (let item of Shoppingcart) {
		weight += item.amount*item.item.weight;
		total += item.amount*item.item.price;
	}
	DB.get({maxweight: {$gte: weight}}, (Shippings) => {
		if (Shippings != null) shipping = Shippings[0].get('price');
		total += shipping;
		total = Math.floor(total*100);
		return callback(total);
	});
}
