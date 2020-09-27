var ShoppingcartView = Backbone.View.extend({
  initialize: function() {
    this.render();
    return this;
  },
  render: function() {
    this.el.innerHTML = '';
    this.collection.each(function(model) {
      var view = new ShoppingcartitemView({model: model});
      this.el.append(view.render().el);
    }.bind(this));
    return this;
	},
});

var ShoppingcartitemView = Backbone.View.extend({
  className: 'item',
  template: _.template(document.getElementById('model-shoppingcart-template').innerHTML),
  render: function() {
    this.el.innerHTML = '';
		this.el.innerHTML = this.template(this.model.attributes);
    return this;
	},
  events: {
    'click img': 'open',
    'click #tag': 'search',
    'change input': 'amount',
    'click #remove': 'delete',
  },
  open: function() {
    this.model.open();
  },
  search: function(e) {
		Backbone.history.navigate('shop/'+e.target.innerText, true);
  },
  amount: function(e) {
    if (e.target.value > this.model.get('item').amount) e.target.value = this.model.get('item').amount;
    this.model.set('amount', e.target.value);
  },
  delete: function() {
    User.get('shoppingcart').remove(this.model);
    this.el.remove();
    this.model.remove();
  },
});
