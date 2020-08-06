var ObjectID = require('mongodb').ObjectID;
var DB = require('../database/item');

const fs = require('fs');
const path = require('path');

this.get = (by, callback) => {
	DB.get(by, (Item) => {
		return callback(Item);
	});
}

this.new = (callback) => {
	DB.new((Item) => {
		return callback(Item);
	});
}

this.update = (id, data, callback) => {
	this.image(data, () => {
		DB.update(id, data, (Item) => {
			return callback(Item);
		});
	});
}

this.stock = (Shoppingcart, callback) => {
	for (let entry of Shoppingcart) {
		if (entry.item.get('amount')-entry.get('amount') < 1) return callback('err');
		entry.item.set('amount', entry.item.get('amount')-entry.get('amount'));
		entry.item.save();
	}
	return callback();
}

this.remove = (id, callback) => {
	DB.remove(id, (Item) => {
		return callback(Item);
	});
}

this.image = (data, callback) => {
	if (data.image.length < 100) return callback();
	var file = data.image;
	file = file.split(';base64,').pop();
	var imgpath = path.join(__dirname, '..', '..', 'views', _Config.template, 'images');
	var filename = data._id+'.png';
	fs.writeFile(imgpath+'/'+filename, file, 'base64', (err) => {
		if (err) return;
		data.image = '/images/'+filename;
		return callback();
	});
}
