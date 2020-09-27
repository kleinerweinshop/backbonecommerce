var Agb = Backbone.View.extend({
	id: 'agb',
	template: _.template(document.getElementById('agb-template').innerHTML),
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
		'click #navi': 'navi',
	},
	navi: function() {
		var el = this.el.querySelector('.navi');
		if (el.style.display == 'grid') return el.style.display = 'none';
		else return el.style.display = 'grid';
	},
});

var Imprint = Backbone.View.extend({
	id: 'imprint',
	template: _.template(document.getElementById('imprint-template').innerHTML),
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
		'click #navi': 'navi',
	},
	navi: function() {
		var el = this.el.querySelector('.navi');
		if (el.style.display == 'grid') return el.style.display = 'none';
		else return el.style.display = 'grid';
	},
});

var Privacy = Backbone.View.extend({
	id: 'privacy',
	template: _.template(document.getElementById('privacy-template').innerHTML),
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
		'click #navi': 'navi',
	},
	navi: function() {
		var el = this.el.querySelector('.navi');
		if (el.style.display == 'grid') return el.style.display = 'none';
		else return el.style.display = 'grid';
	},
});

var Footerpayment = Backbone.View.extend({
	id: 'payment',
	template: _.template(document.getElementById('footerpayment-template').innerHTML),
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
		'click #navi': 'navi',
	},
	navi: function() {
		var el = this.el.querySelector('.navi');
		if (el.style.display == 'grid') return el.style.display = 'none';
		else return el.style.display = 'grid';
	},
});
