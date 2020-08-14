var ShoppingcartCollection = Backbone.Collection.extend({
	model: ShoppingcartModel,
	total: function(){
		var total = 0;
		this.each((model) => {
			total += model.get('amount')*parseFloat(model.get('item').price);
		});
		return total.toFixed(2);
	},
	discount: function(){
		return (this.subquantity() > 11) ? (this.subtotal() * .1) : 0;
	},
	pretax: function(){
		return this.totall() - this.discount();
	},
	tax: function(){
		return this.pretax() * 0.085;
	},
});
