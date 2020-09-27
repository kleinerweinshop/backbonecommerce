var ShoppingcartCollection = Backbone.Collection.extend({
	model: ShoppingcartModel,
	initialize: function() {
		this.on('add remove', this.update);
	},
	total: function(shipping){
		var total = 0;
		if (shipping) total += shipping;
		this.each((model) => {
			total += model.get('amount')*parseFloat(model.get('item').price);
		});
		return total.toFixed(2);
	},
	getData: function(callback) {
		Socket.emit('shoppingcart.get');
		Socket.once('shoppingcart.get', (data) => {
			for (let entry of data) {
				var model = new ShoppingcartModel(entry);
				this.add(model);
			};
			this.update();
			return callback(this);
		});
	},
	update: function() {
		if (!document.querySelector('#count')) return;
		document.querySelector('#count').innerText = '('+this.length+')';
	}
});
