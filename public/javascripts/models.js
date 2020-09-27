var Socket = io();

Socket.on('connect', () => {
	var user;
	if (localStorage.getItem('me')) user = JSON.parse(localStorage.me);
	Socket.emit('session', user);
	Socket.on('user', (user) => {
		var data = JSON.stringify(user);
		localStorage.setItem('me', data);
		User = new UserModel(user);
		new ShoppingcartCollection().getData((data) => {
			User.set('shoppingcart', data);
		});
	});
});

var UserModel = Backbone.Model.extend({
	initialize: function() {
		this.on('change:firstname', this.save);
		this.on('change:lastname', this.save);
		this.on('change:email', this.save);
		this.on('change:street', this.save);
		this.on('change:town', this.save);
		this.on('change:zip', this.save);
	},
	defaults: {
		firstname: '',
		lastname: '',
		email: '',
		street: '',
		town: '',
		zip: '',
		country: 'Germany',
		shoppingcart: [],
	},
	save: function(e) {
		Socket.emit('user.set', e.changed);
		var data = JSON.stringify(this.attributes);
		localStorage.setItem('me', data);
	},
	check: function(callback) {
		var err = false;
		_.each(this.attributes, (value, key) => {
		  if (value === '') {
				if (key == 'session') return callback();
				err = true;
				return callback(key);
			}
		});
		if (err == false) return callback();
	},
});

var ItemModel = Backbone.Model.extend({
	initialize: function() {
		this.set('base', this.baseprice());
	},
	defaults: {
		name: '',
		image: '',
		info: '',
		tags: [],
		price: 0,
		liter: 0,
		base: 0,
	},
	open: function() {
		Backbone.history.navigate('item/'+this.get('_id'), true);
	},
	baseprice: function() {
		if (this.get('liter') == 0) return 0;
		var base = this.get('price')*1000/this.get('liter');
		return base.toFixed(2);
	},
	tocart: function() {
		var model = _.find(User.get('shoppingcart').models, (model) => {
			if (!model.get('item')) return;
			return model.get('item')._id == this.get('_id');
		});
		if (User.get('shoppingcart').contains(model)) return;
    Socket.emit('shoppingcart.add', this.get('_id'));
    User.get('shoppingcart').add(this);
    document.querySelector('#navi').classList.remove('pulse');
    void document.querySelector('#navi').offsetWidth;
    document.querySelector('#navi').classList.add('pulse');
	}
});

var CategoryModel = Backbone.Model.extend({
	defaults: {
		name: '',
		image: '',
		order: 0,
		desc: '',
		amount: 0,
	},
	open: function() {
    var site = new Category({
      model: this,
    });
		new Site().el.append(site.el);
  },
});

var ShoppingcartModel = Backbone.Model.extend({
	initialize: function() {
		this.on('change:amount', this.amount);
	},
	defaults: {
		amount: '',
		item: ItemModel,
	},
	open: function() {
		Backbone.history.navigate('item/'+this.get('item')._id, true);
	},
	amount: function() {
		Socket.emit('shoppingcart.amount', this);
	},
	remove: function() {
		Socket.emit('shoppingcart.remove', this.get('_id'));
		this.destroy();
	}
});
