var CategoriesView = Backbone.View.extend({
  initialize: function() {
    this.render();
    return this;
  },
  render: function() {
    this.el.innerHTML = '';
    this.collection.each(function(model) {
      var view = new CategoryView({model: model});
      this.el.append(view.render().el);
    }.bind(this));
    return this;
	},
});

var CategoryView = Backbone.View.extend({
  className: 'category',
  template: _.template(document.getElementById('model-category-template').innerHTML),
  render: function() {
    this.el.innerHTML = '';
		this.el.innerHTML = this.template(this.model.attributes);
    return this;
	},
  events: {
    'click': 'open',
  },
  open: function() {
    Backbone.history.navigate('shop/'+this.model.get('_id'), true);
  },
});
