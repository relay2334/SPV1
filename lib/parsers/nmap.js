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

	function scan() {
		console.log("Host Discovery Scan!");
                var ip = config.Nmap.target_range;
                var arr = ip.split(".");
                var oct = arr[0] + "." + arr[1] + "." + arr[2];
                var range = arr[3].split("-")
                var min = parseInt(range[0]);
                var max = parseInt(range[1]);
                for(var i=min;i<(max+1);i++) {
                        var get = oct + "." + i;
                        var child = spawn('nmapFormat.sh ' + get, [], {shell: '/bin/bash'});
			child.stdout.on('data', function(data) {
				var raw = data.split("*");
				var ip = "" + raw[0];
				var ports = parseInt(raw[1]);
				Host.findOne({
					where: {
						ip: ip
					}
				}).then(function(err, result) {
					if (!(result)) {
						Host.create({
							ip: ip,
							ports: ports
						});
						console.log('Nmap Host Added: Added ' + ip + '\t Open Ports: ' + ports);
						io.emit('hosts', {
							ip: ip,
							ports: ports
						});
					}
				});
			}
		})

		child.stderr.on('data', function(data) {
			var raw = data.split("*");
			console.log('Nmap: (stderr): Host ' + raw[0] + ' discovered. Ports Open:' + raw[1] + ' '));
		})
	}
	
	function run() {
                console.log('Nmap: Instantiating nmap process.')
                scan();
		setInterval(function(){
                	scan();
                }, config.Nmap.interval)
		
	}

	// Lets get this baby started!
	var child = run();
}


module.exports = { parser: nmapParser}
