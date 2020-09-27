const fs = require('fs');
const path = require('path');
const pug = require('pug');
const nodemailer = require('nodemailer');

var ObjectID = require('mongodb').ObjectID;
var DB = require('../database/order');
var Shoppingcart = require('./shoppingcart');


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

this.new = (user, payment, callback) => {
	Shoppingcart.get({
		user: user,
	}, (shoppingcart) => {
		var array = new Array;
		for (let entry of shoppingcart) {
			array.push(ObjectID(entry.get('_id')));
			entry.item.set('amount', entry.item.get('amount')-entry.get('amount'));
			entry.item.save();
		}
		DB.new(user, array, payment, (Order) => {
			return callback(Order);
		});
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

this.mail = (User, Order) => {
	if (_Mail.sendmail != true) return;
	var email = path.join(__dirname, '..', '..', 'views', _Config.template, 'email', 'order.pug');
	if (!email) return;
	fs.readFile(email, 'utf8', function(err, file){
    if (err) return console.log(err);
		var template = pug.compile(file);
		let mail = {
			from: _Mail.from, // sender address
			to: User.get('email'), // list of receivers
			subject: 'Bestellbestätigung', // Subject line
			text: 'Vielen Dank für Ihre Bestellung!', // plain text body
			html: template({
				logo: _Config.url+'/images/logo.png',
				order: Order.get('_id'),
				firstname: User.get('firstname'),
				lastname: User.get('lastname'),
				street: User.get('street'),
				zip: User.get('zip'),
				country: User.get('country')
			}),
		}
		let transporter = nodemailer.createTransport(_Mail.data);
		transporter.sendMail(mail, (err, data) => {
			if (err) return console.log('SENDMAIL: '+err);
		});
	});
}

this.count = (by, callback) => {
	DB.count(by, (amount) => {
		return callback(amount);
	});
}
