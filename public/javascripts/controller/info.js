var Info = Backbone.View.extend({
	id: 'info',
	template: _.template(document.getElementById('info-template').innerHTML),
	initialize: function() {
		this.void(() => {
			this.render();
		});
		return this;
	},
	render: function() {
		this.el.innerHTML = '';
		this.el.innerHTML = this.template();
		return this;
	},
	events: {
		'click #back': () => Backbone.history.navigate('', true),
		'click #navi': 'navi',
	},
	navi: function() {
		var el = this.el.querySelector('.navi');
		if (el.style.display == 'grid') return el.style.display = 'none';
		else return el.style.display = 'grid';
	},
	void: function(callback) {
		Socket.emit('void');
		Socket.once('void', () => {
			return callback();
		});
	},
});
