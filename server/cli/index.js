const readline = require('readline');

var New = require('./new');

module.exports = () => {
	var cli = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout,
	  terminal: false
	});
	cli.on('line', (input) => {
		input = input.toLowerCase();
		var space = input.length;
		if (input.match(/\s/)) space = input.match(/\s/).index;
		var command = input.slice(0, space);
		var arg = input.slice(space+1, input.length);
		if (command in commands) return commands[command](arg);
	});

	var commands = {
    new: async function(name) {
			if (!name) return console.error('Please enter a name');
			await New.controller(name, (err) => {
				if (err) return console.error(err);
				console.log('> javascript controller '+name+'.js created');
			});
			await New.view(name, (err) => {
				if (err) return console.error(err);
				console.log('> view site '+name+'.pug created');
			});
			await New.routing(name, (err) => {
				if (err) return console.error(err);
				console.log('> routes created');
			});
		await	New.links(name, (err) => {
				if (err) return console.error(err);
				console.log('> links created');
				console.log('> '+_Config.url+'/'+name);
			});
    },
    exit: function() {
			console.log('Bye!');
    	process.exit();
    }
	}
}
