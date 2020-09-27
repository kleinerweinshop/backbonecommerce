var Item = Backbone.View.extend({
	id: 'item',
	template: _.template(document.getElementById('item-template').innerHTML),
	initialize: function(options) {
		_.extend(this, _.pick(options, '_id'));
		this.getItem((item) => {
			this.model = item;
			this.render();
		});
		return this;
	},
	render: function() {
		this.el.innerHTML = '';
		this.el.innerHTML = this.template(this.model.attributes);
		return this;
	},
	events: {
		'click #back': () => Backbone.history.history.back(),
		'click #navi': 'navi',
		'click #tag': 'search',
		'click button': 'tocart',
		'mousemove .image': 'zoom',
		'touchmove .image': 'zoom',
	},
	navi: function() {
		var el = this.el.querySelector('.navi');
		if (el.style.display == 'grid') return el.style.display = 'none';
		else return el.style.display = 'grid';
	},
	search: function(e) {
		Backbone.history.navigate('shop/'+e.target.innerText, true);
  },
	getItem: function(callback) {
		Socket.emit('item.get', this._id);
		Socket.once('item.get', (data) => {
			var model = new ItemModel(data);
			return callback(model);
		});
	},
	tocart: function(e) {
    if (e.target.getAttribute('inactive') == 'true') return Backbone.history.navigate('shoppingcart', true);;
    e.target.setAttribute('inactive', true);
		this.el.querySelector('#navi').className += 'pulse';
    Socket.emit('shoppingcart.add', this.model.get('_id'));
    User.set('shoppingcart', User.get('shoppingcart')+1);
  },
	zoom: function(e) {
		var zoom = 4;
		var img = this.el.querySelector('#image').firstChild;
		var image = img.getBoundingClientRect();
		var lens = this.el.querySelector('#lens');
		var w = lens.offsetWidth / 2;
  	var h = lens.offsetHeight / 2;
		var x = e.clientX-image.left;
		var y = e.clientY-image.top;
		if (x < 0 || x > image.width) return;
		if (y < 0 || y >image.height) return;
		lens.style.transform = 'translateX('+(x-w)+'px)';
		lens.style.transform += 'translateY('+(y-h)+'px)';
		lens.style.backgroundImage = 'url('+img.src+')';
		lens.style.backgroundSize = (image.width*zoom)+'px '+(image.height*zoom)+'px';
		lens.style.backgroundPosition = '-'+((x*zoom)-w)+'px -'+((y*zoom)-h)+'px';
	},
});
