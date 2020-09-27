var Index = Backbone.View.extend({
	id: 'index',
	template: _.template(document.getElementById('index-template').innerHTML),
	initialize: function() {
		this.getItems(3, (items) => {
			this.render();
			this.video();
			new ItemsView({
				el: this.el.querySelector('#items'),
				collection: items,
			});
		});
		return this;
	},
	render: function() {
		this.el.innerHTML = '';
		this.el.innerHTML = this.template();
		return this;
	},
	events: {
		'click #navi': 'navi',
		'click #more': 'more',
	},
	navi: function() {
		var el = this.el.querySelector('.navi');
		if (el.style.display == 'grid') return el.style.display = 'none';
		else return el.style.display = 'grid';
	},
	video: function() {
		if (window.screen.width < 750) return;
		if (!this.el.querySelector('video')) return;
		var video = document.createElement('source');
		video.src = '/images/video.mp4';
		video.type= 'video/mp4';
		this.el.querySelector('video').appendChild(video);
	},
	more: function() {
		Socket.emit('items.get');
		Socket.once('items.get', (data) => {
			var items = new Backbone.Collection;
			for (let i = 0; i < data.length; i++) {
				var model = new ItemModel(data[i]);
				items.add(model);
			} new ItemsView({
				el: this.el.querySelector('#items'),
				collection: items,
			});
		});
	},
	getItems: function(amount, callback) {
		Socket.emit('items.get');
		Socket.once('items.get', (data) => {
			var items = new Backbone.Collection;
			for (let i = 0; i < data.length; i++) {
				if (i > 2) return callback(items);
				var model = new ItemModel(data[i]);
				items.add(model);
			} return callback(items);
		});
	},
});
