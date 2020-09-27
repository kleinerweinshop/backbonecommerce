var Site = Backbone.View.extend({
	el: '.site',
	initialize: function() {
		this.render();
		return this;
	},
	render: function() {
		window.scrollTo(0, 0);
		this.el.innerHTML = '';
		return this;
	},
	events: {
		'click #logo': () => Backbone.history.navigate('', true),
		'click #toindex': () => Backbone.history.navigate('', true),
		'click #toshop': () => Backbone.history.navigate('shop', true),
		'click #toinfo': () => Backbone.history.navigate('info', true),
		'click #tocart': () => Backbone.history.navigate('shoppingcart', true),
		'click #footerimprint': () => Backbone.history.navigate('imprint', true),
		'click #footeragb': () => Backbone.history.navigate('agb', true),
		'click #footerprivacy': () => Backbone.history.navigate('privacy', true),
		'click #footerpayment': () => Backbone.history.navigate('payment', true),
	},
});
