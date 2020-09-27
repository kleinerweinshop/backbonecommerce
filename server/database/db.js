const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	firstname: String,
	lastname: String,
	email: String,
	street: String,
	town: String,
	zip: String,
	country: {type: String, default: 'Germany'},
	orders: {type: Number, default: 0},
	selected: {type: Boolean, default: false},
	session: {type: String, default: ''},
	language: {type: String, default: 'en'},
	ip: {type: Array, select: false},
	useragent: {type: String, select: false},
	date: {type: Date, default: Date.now},
});
mongoose.model('Users', UserSchema);

var ItemSchema = new Schema({
	name: String,
	category: {type: Schema.Types.ObjectId, ref: 'Categories', default: null},
	image: String,
	info: String,
	tags: Array,
	price: Number,
	liter: {type: Number, default: 0},
	amount: {type: Number, default: 0},
	weight: {type: Number, default: 0},
	shipping: {type: Number, default: 0},
});
mongoose.model('Items', ItemSchema);

var CategorySchema = new Schema({
	name: String,
	image: String,
	order: Number,
	desc: String,
	amount: Number,
});
mongoose.model('Categories', CategorySchema);

var ShoppingcartSchema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'Users'},
	item: {type: Schema.Types.ObjectId, ref: 'Items'},
	amount: {type: Number, default: 1},
	finished: {type: Boolean, default: false},
	date: {type: Date, default: Date.now},
});
mongoose.model('Shoppingcart', ShoppingcartSchema);

var OrderSchema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'Users'},
	shoppingcart: [{type: Schema.Types.ObjectId, ref: 'Shoppingcart'}],
	payment: String,
	value: Number,
	checked: {type: Boolean, default: false},
	finished: {type: Boolean, default: false},
	date: {type: Date, default: Date.now},
});
mongoose.model('Orders', OrderSchema);

var ShippingSchema = new Schema({
	type: String,
	maxweight: {type: Number, default: 0},
	maxlength: {type: Number, default: 0},
	maxwidth: {type: Number, default: 0},
	maxheight: {type: Number, default: 0},
	price: {type: Number, default: 0},
});
mongoose.model('Shipping', ShippingSchema);

var LogSchema = new Schema({
	key: String,
	date: {type: Date, default: Date.now},
	data: {},
});
mongoose.model('Logs', LogSchema);
