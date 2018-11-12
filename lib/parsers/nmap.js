//TODO
//
// GREP NMAP OUTPUT: https://github.com/leonjza/awesome-nmap-grep
//
var spawn = require('child_process').spawn;
var config = require('config');
var httpreq = require('httpreq');
var db = require('../models');
var md5 = require('md5');
var fs = require('fs');
var io = require('../web').io;

//TODO
//
// GREP NMAP OUTPUT: https://github.com/leonjza/awesome-nmap-grep
//
var spawn = require('child_process').spawn;
var config = require('config');
var httpreq = require('httpreq');
var db = require('../models');
var md5 = require('md5');
var fs = require('fs');
var io = require('../web').io;

function nmapParser() {

	function run() {
		console.log('Nmap: Instantiating nmap process.')
		while (true) {setTimeout(function(){
		
		var ip = config.Nmap.target_range;
		var arr = ip.split(".");
		var oct = arr[0] + "." + arr[1] + "." + arr[2];
		var range = arr[3].split("-")
		var min = parseInt(range[0]);
		var max = parseInt(range[1]);
		for(var i=min;i<max;i++) {
			var get = oct + "." + i;
			var child = spawn('nmapFormat.sh ' + get, [], {shell: '/bin/bash'});
		}
         }, config.Nmap.interval)}
		
		// Airdump-ng data capture...
		child.stdout.on('data', function(data) {
			
				var rdata = ;//Regex to pull out network info
				var raw = rdata.exec(data.toString());
				
				
				var ip = ;
				var ports = ;


				// Next we will search the database to see if we have seen this specific
				// host information before.  If we havent, then we will create a
				// new database object with the information we discovered and then inform
				// the WebUI of the new data.
				Network.findOne({
					where: {
						ip: ip
					}
				}).then(function(err, result) {
					if (!(result)) {
						Host.create({
							ip: ip,
							ports: ports
						});
						console.log('Nmap Host Added: Added ' + ip + '\t Open Ports: ' + auth);
						io.emit('hosts', {
							ip: ip,
							ports: ports
						});
					}
				});
			}
		})

		child.stderr.on('data', function(data) {
			console.log('Nmap: (stderr): ' + data.toString().replace(/(\r\n|\n|\r)/gm, ' '));
		})

		// If driftnet exists for some reason, log the event to the console
		// and then initiate a new instance to work from.
		child.on('close', function(code) {
			console.log('Nmap: child terminated with code ' + code);
			child = run()
		})

		child.on('error', function(error) {
			console.log('Nmap: Failed to start process');
		})
	}

	// Lets get this baby started!
	var child = run();
}


module.exports = { parser: nmapParser}
