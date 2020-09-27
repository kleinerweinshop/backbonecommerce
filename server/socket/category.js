var ObjectID = require('mongodb').ObjectID;
var DB = require('../database/category');
var Items = require('../database/item');

const fs = require('fs');
const path = require('path');

this.get = (by, callback) => {
	DB.get(by, (Categories) => {
		Categories.forEach((category, i) => {
			Items.count({
				category: category.get('_id')
			}, (amount) => {
				category.set('amount', amount);
				if (i >= Categories.length-1)	return callback(Categories);
			});
		});
	});
}

this.new = (callback) => {
	DB.new((Category) => {
		return callback(Category);
	});
}

this.update = (id, data, callback) => {
	this.image(data, () => {
		DB.update(id, data, (Category) => {
			return callback(Category);
		});
	});
}

this.remove = (id, callback) => {
	DB.remove(id, (Category) => {
		return callback(Category);
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
