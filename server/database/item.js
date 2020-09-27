var mongoose = require('mongoose');
var Items = mongoose.model('Items');

this.get = (by, skip, callback) => {
	Items.find(by).
	sort('-amount').
	populate('category').
	skip(skip).
	limit(10).
	exec((err, result) => {
		if (err) return console.error(err);
		return callback(result);
	});
}

this.new = (callback) => {
	var item = new Items();
	item.save((err, entry) => {
		if (err) return console.error(err);
		return callback(entry);
	});
}

this.update = (id, data, callback) => {
	Items.findByIdAndUpdate(mongoose.Types.ObjectId(id), {$set: data}).
	then((result) => {
		return callback(result);
	});
}

this.remove = (id, callback) => {
	Items.findByIdAndRemove(mongoose.Types.ObjectId(id)).
	then((result) => {
		return callback(result);
	});
}

this.count = (by, callback) => {
	Items.countDocuments(by, (err, amount) => {
    if (err) return console.error(err);
    return callback(amount);
  });
}
