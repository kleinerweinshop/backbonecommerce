var ListView = Backbone.View.extend({
  initialize: function() {
    this.render();
    return this;
  },
  render: function() {
    this.el.innerHTML = '';
    this.collection.each(function(model) {
      var view = new ListModelView({model: model});
      this.el.append(view.render().el);
    }.bind(this));
    return this;
	},
});

var ListModelView = Backbone.View.extend({
  className: 'item',
  render: function() {
    this.template = this.model.template;
    this.el.innerHTML = '';
		this.el.innerHTML = this.template(this.model.attributes);
    return this;
	},
  events: {
    'click div': 'open',
    'click input': 'select',
  },
  open: function() {
    if (!this.model.attributes) return;
    this.model.open();
  },
  select: function(e) {
    this.model.select();
  },
});
