var DEFAULT = Backbone.View.extend({
	id: 'DEFAULT',
	template: _.template(document.getElementById('DEFAULT-template').innerHTML),
	initialize: function() {
		this.render();
		return this;
	},
	render: function() {
		this.el.innerHTML = '';
		this.el.innerHTML = this.template();
		return this;
	},
	events: {
	},
});
