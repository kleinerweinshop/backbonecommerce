_Config = require('../config.json');
_Traffic = 0;

const fs = require('fs');
const express = require('express');
const parser = require('body-parser');
const favicon = require('serve-favicon');
const static = require('serve-static');
const http = require('http');
const https = require('https');
const path = require('path');
const mongoose = require('mongoose');
const socketio = require('socket.io');

const database = require('./database/db');
const routes = require('./routing');
const cli = require('./cli');
const sockets = require('./socket');


var app = express();
// all environments
process.stdout.write('pending...');
app.set('port', process.env.PORT || _Config.port);
app.set('safeport', process.env.PORT || _Config.safeport);
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'pug');
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));
if (_Config.ssl == true) {
	app.use ((req, res, next) => {
		if (req.secure) return next();
		else return res.redirect('https://' + req.headers.host + req.url);
	});
}

//statics
app.use(favicon(path.join(__dirname, '..', 'views', _Config.template, 'images', 'favicon.ico')));
app.use(static(path.join(__dirname, '..', 'views', _Config.template)));
app.use(static(path.join(__dirname, '..', 'public')));
routes(app);

const options = {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false};
mongoose.connect('mongodb://localhost:'+_Config.mongodb, options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	process.stdout.write("\r\x1b[K");
	var key, cert;
	if (_Config.sslkey) key = fs.readFileSync(_Config.sslkey);
	if (_Config.sslcert) cert = fs.readFileSync(_Config.sslcert)
	const options = {
		key  : key,
		cert : cert
	};
	var httpServer = http.createServer(app);
	var httpsServer = https.createServer(options, app);
	httpServer.listen(app.get('port'), () => {
		console.log('Server listening on port '+app.get('port'));
	});
	httpsServer.listen(app.get('safeport'), () => {
		console.log('Server listening on safe port '+app.get('safeport'));
	});
	var	io;
	if (_Config.ssl == true) io = socketio(httpsServer);
	else io = socketio(httpServer);
	sockets(io);
	cli();
});
