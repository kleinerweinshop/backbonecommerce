var ObjectID = require('mongodb').ObjectID;
var DB = require('../database/shoppingcart');

this.get = (by, callback) => {
	by['finished'] = false;
	DB.get(by, (result) => {
		return callback(result);
	});
}

this.remove = (User, by, callback) => {
	DB.remove(by);
	DB.count({
		user: User.get('_id'),
	}, (amount) => {
		User.set('shoppingcart', amount-1);
		User.save();
	});
}

this.new = (User, id) => {
	DB.new(User.get('_id'), id, (entry) => {});
}

this.empty = (User) => {
	DB.empty({user: User.get('_id')}, () => {});
}
