var ObjectID = require('mongodb').ObjectID;
var DB = require('../database/item');

const fs = require('fs');
const path = require('path');

this.get = (data, skip, callback) => {
	var array = new Array;
	if (ObjectID.isValid(data) == true) array.push({category: data});
	if (data) array.push({name: {$regex: new RegExp(data, 'i')}});
	if (data) array.push({tags: {$in: new RegExp(data, 'i')}});
	if (array.length == 0) array.push({category: {$ne: null}});
	DB.get({
		$or: array,
		amount: {$gt: 0}
	}, skip, (Items) => {
		return callback(Items);
	});
}

this.getOne = (id, callback) => {
	DB.get({
		_id: id,
		amount: {$gt: 0}
	}, 0, (Items) => {
		return callback(Items[0]);
	});
}

this.getAll = (by,skip, callback) => {
	DB.get(by, skip, (Items) => {
		return callback(Items);
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
	if (!data.image || data.image.length < 100) return callback();
	var file = data.image;
	file = file.split(';base64,').pop();
	var imgpath = path.join(__dirname, '..', '..', 'views', _Config.template, 'images');
	var filename = data._id+'.png';
	fs.writeFile(imgpath+'/'+filename, file, 'base64', (err) => {
		if (err) return console.error(err);
		data.image = '/images/'+filename;
		return callback();
	});
}
