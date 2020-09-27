var mongoose = require('mongoose');
var Shippings = mongoose.model('Shipping');

this.get = (by, callback) => {
	Shippings.find(by).
	sort('maxweight').
	exec((err, result) => {
		if (err) return console.error(err);
		return callback(result);
	});
}

this.new = (callback) => {
	var shipping = new Shippings();
	shipping.save((err, entry) => {
		if (err) return console.error(err);
		return callback(entry);
	});
}

this.update = (id, data, callback) => {
	Shippings.findByIdAndUpdate(mongoose.Types.ObjectId(id), {$set: data}).
	then((result) => {
		return callback(result);
	});
}

this.remove = (id, callback) => {
	Shippings.findByIdAndRemove(mongoose.Types.ObjectId(id)).
	then((result) => {
		return callback(result);
	});
}
