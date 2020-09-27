var mongoose = require('mongoose');
var Categories = mongoose.model('Categories');

this.get = (by, callback) => {
	Categories.find(by).
	sort('order').
	exec((err, result) => {
		if (err) return console.error(err);
		return callback(result);
	});
}

this.new = (callback) => {
	var category = new Categories();
	category.save((err, entry) => {
		if (err) return console.error(err);
		return callback(entry);
	});
}

this.update = (id, data, callback) => {
	Categories.findByIdAndUpdate(mongoose.Types.ObjectId(id), {$set: data}).
	then((result) => {
		return callback(result);
	});
}

this.remove = (id, callback) => {
	Categories.findByIdAndRemove(mongoose.Types.ObjectId(id)).
	then((result) => {
		return callback(result);
	});
}
