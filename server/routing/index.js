var Btc = require('../socket/btc');

module.exports = (app) => {
	app.get('/dashboard/*', (req, res) => {
		if (_Config.dashboard_protect && _Config.dashboard_protect != req.get('User-Agent'))
			return res.render(_Config.template+'/index');
		return res.render('dashboard/index');
	});
	app.get('*', (req, res) => {
		return res.render(_Config.template+'/index');
	});
}
