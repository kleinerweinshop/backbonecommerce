var Categories = Backbone.View.extend({
	id: 'categories',
	template: _.template(document.getElementById('categories-template').innerHTML),
	initialize: function() {
		this.render();
		this.getItems((categories) => {
			new ListView({
				el: this.el.querySelector('#categories'),
				collection: categories,
			});
		});
		return this;
	},
	render: function() {
		this.el.innerHTML = '';
		this.el.innerHTML = this.template();
		this.el.querySelector('#tocategories').setAttribute('active', true);
		return this;
	},
	events: {
		'click a#new': 'new',
	},
	getItems: function(callback) {
		Socket.emit('d.categories.get');
		Socket.once('d.categories.get', (data) => {
			var collection = new Backbone.Collection;
			for (let entry of data) {
				var model = new CategoryModel(entry);
				collection.add(model);
			}
			return callback(collection);
		});
	},
	new: function() {
		Socket.emit('d.categories.new');
		Socket.once('d.categories.new', (data) => {
			var model = new CategoryModel(data);
			var site = new Category({
				model: model,
			});
			new Site().el.append(site.el);
		});
	}
});

var Category = Backbone.View.extend({
	id: 'category',
	template: _.template(document.getElementById('category-template').innerHTML),
	initialize: function() {
		this.render();
		return this;
	},
	render: function() {
		this.el.innerHTML = '';
		this.el.innerHTML = this.template(this.model.attributes);
		this.el.querySelector('#tocategories').setAttribute('active', true);
		Backbone.history.navigate('dashboard/category', false);
		return this;
	},
	events: {
		'change input#image': 'image',
		'change input#input': 'input',
		'change textarea#input': 'input',
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
	send: function() {
		Socket.emit('d.category.change', this.model.attributes);
		var site = new Categories();
		new Site().el.append(site.el);
	},
	delete: function() {
		if (!confirm('Do you want to delete this?')) return;
		Socket.emit('d.category.remove', this.model.get('_id'));
		var site = new Categories();
		new Site().el.append(site.el);
	}
});
