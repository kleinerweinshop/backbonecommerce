const fs = require('fs');
const path = require('path');

this.controller = (name, callback) => {
	var newfile;
	var folder = path.join(__dirname, 'default');
	var controller = path.join(__dirname, '..', '..', 'public', 'javascripts', 'controller');
	var file = fs.createReadStream(path.join(folder, 'default.js'), 'utf8');
	file.on('data', (data) => {
		newfile = data.toString().replace('DEFAULT', name.charAt(0).toUpperCase()+name.slice(1));
		newfile = newfile.replace(/DEFAULT/gi, name);
	});
	file.on('end', () => {
  	fs.writeFile(path.join(controller, name+'.js'), newfile, (err) => {
		  if (err) return callback(err);
			return callback();
		});
	});
}

this.view = (name, callback) => {
	var newfile;
	var folder = path.join(__dirname, 'default');
	var view = path.join(__dirname, '..', '..', 'views', _Config.template, 'sites');
	var file = fs.createReadStream(path.join(folder, 'default.jade'), 'utf8');
	file.on('data', (data) => {
		newfile = data.toString().replace(/DEFAULT/gi, name);
	});
	file.on('end', () => {
  	fs.writeFile(path.join(view, name+'.jade'), newfile, (err) => {
		  if (err) return callback(err);
			return callback();
		});
	});
}

this.links = (name, callback) => {
	var newfile;
	var index = path.join(__dirname, '..', '..', 'views', _Config.template, 'index.jade');
	var file = fs.createReadStream(index, 'utf8');
	file.on('data', (data) => {
		newfile = data.toString();
		var sites = '//-----sites-----//\n include ./sites/'+name+'.jade';
		var controller = "//-----controller-----//\n script(type='text/javascript' src='/javascripts/controller/"+name+".js')";
		newfile = newfile.replace('//-----sites-----//', sites);
		newfile = newfile.replace('//-----controller-----//', controller);
	});
	file.on('end', () => {
  	fs.writeFile(index, newfile, (err) => {
		  if (err) return callback(err);
			return callback();
		});
	});
}

this.routing = (name, callback) => {
	var newfile;
	var routing = path.join(__dirname, '..', '..', 'public', 'javascripts', 'routing.js');
	var file = fs.createReadStream(routing, 'utf8');
	file.on('data', (data) => {
		newfile = data.toString();
		var sites = "//-----additional-----//\n\t\t'"+name+"': '"+name+"',";
		var route = "//-----new-----//\n\t"+name+": () => {\n\t\tvar site = new "+name.charAt(0).toUpperCase()+name.slice(1)+"();\n\t\tnew Site().el.append(site.el);\n\t},";
		newfile = newfile.replace('//-----additional-----//', sites);
		newfile = newfile.replace('//-----new-----//', route);
	});
	file.on('end', () => {
  	fs.writeFile(routing, newfile, (err) => {
		  if (err) return callback(err);
			return callback();
		});
	});
}
