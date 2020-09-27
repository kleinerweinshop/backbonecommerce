var Items = Backbone.View.extend({
	id: 'items',
	template: _.template(document.getElementById('items-template').innerHTML),
	initialize: function() {
		this.render();
		this.getItems((items) => {
			new ListView({
				el: this.el.querySelector('#items'),
				collection: items,
			});
		});
		return this;
	},
	render: function() {
		this.el.innerHTML = '';
		this.el.innerHTML = this.template();
		this.el.querySelector('#toitems').setAttribute('active', true);
		return this;
	},
	events: {
		'click a#new': 'new',
	},
	getItems: function(callback) {
		Socket.emit('d.items.get');
		Socket.once('d.items.get', (data) => {
			var collection = new Backbone.Collection;
			for (let entry of data) {
				var model = new ItemModel(entry);
				collection.add(model);
			}
			return callback(collection);
		});
	},
	new: function() {
		Socket.emit('d.items.new');
		Socket.once('d.items.new', (data) => {
			var model = new ItemModel(data);
			var site = new Item({
				model: model,
			});
			new Site().el.append(site.el);
		});
	}
});

var Item = Backbone.View.extend({
	id: 'item',
	template: _.template(document.getElementById('item-template').innerHTML),
	initialize: function() {
		this.getCategories((categories) => {
			this.render(categories);
		});
		return this;
	},
	render: function(categories) {
		this.el.innerHTML = '';
		this.el.innerHTML = this.template({
			categories: categories,
			item: this.model.attributes,
		});
		this.el.querySelector('#toitems').setAttribute('active', true);
		Backbone.history.navigate('dashboard/item', false);
		return this;
	},
	events: {
		'change input#image': 'image',
		'change input#input': 'input',
		'change select#input': 'input',
		'change textarea#input': 'input',
		'change input#tags': 'tags',
		'click button#send': 'send',
		'click button#remove': 'delete',
	},
	image: function(e) {
		var fReader = new FileReader();
		var file = e.target.files[0];
		fReader.readAsDataURL(file);
		fReader.onload = (event) => {
			this.el.querySelector('#image').src = event.target.result;
			this.model.set('image', event.target.result);
		}
	},
	input: function(e) {
		this.model.set(e.target.name, e.target.value);
	},
	tags: function(e) {
		var array = e.target.value.split(',');
		var result = new Array;
		_.each(array, (tag) => {
			if (tag.charCodeAt(0) == 32) tag = tag.substring(1);
			result.push(tag);
		});
		this.model.set('tags', result);
	},
	send: function() {
		Socket.emit('d.item.change', this.model.attributes);
		var site = new Items();
		new Site().el.append(site.el);
	},
	delete: function() {
		if (!confirm('Do you want to delete this?')) return;
		Socket.emit('d.item.remove', this.model.get('_id'));
		var site = new Items();
		new Site().el.append(site.el);
	},
	getCategories: function(callback) {
		Socket.emit('d.categories.get');
		Socket.once('d.categories.get', (categories) => {
			return callback(categories);
		});
	},
});
