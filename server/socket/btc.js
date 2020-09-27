const coinbase = require('coinbase-commerce-node');

var Orders = require('./order');
var Users = require('./user');

var Client = coinbase.Client;
var Charge = coinbase.resources.Charge;

this.pay = (User, total, callback) => {
	total = total/100;
	Charge.create({
		name: 'BTC Payment to kleinerweinshop.de',
    pricing_type: 'fixed_price',
		redirect_url: _Config.url+'/thanks',
    local_price: {
        amount: total,
        currency: _Payment.currency,
    },
		metadata: {
			user: User.get('_id'),
		},
    requested_info: []
	}, (err, response) => {
	  if (err) return console.error(err);
	  return callback(response);
	});
}

this.update = () => {
	Charge.all({}, (err, list) => {
	  if (err) return console.error(err);
		for (let entry of list) {
			if (!entry.confirmed_at) return;
			Orders.count({payment: entry.id}, (amount) => {
				if (amount > 0) return;
				Users.get1({_id: entry.metadata.user}, (User) => {
					if (!User) return;
					Orders.new(entry.metadata.user, entry.id, (Order) => {
						Orders.mail(User, Order);
						User.set('orders', User.get('orders')+1);
					});
				});
			});
		}
	});
}

if (!_Payment.btc_sectretkey) return;
Client.init(_Payment.btc_sectretkey);
