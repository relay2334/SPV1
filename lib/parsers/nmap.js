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

function airmonParser() {

	function run() {
		console.log('Nmap: Instantiating nmap process.')

		var child = spawn('airodump-ng /*ARGUMENTS*/ ' + config.Airmon.interface, [], {shell: '/bin/bash'});

		
		while (true) {setTimeout(function(){
         
      }, config.Airmon.interval);}
		
		// Airdump-ng data capture...
		child.stdout.on('data', function(data) {
			while (true) { setTimeout(function(){
			
				var rdata = ;//Regex to pull out network info
				var raw = rdata.exec(data.toString());
				
				
				var essid = ;
				var auth = ;
				var bssid = ;
				var firstSeen = ;
				var lastSeen = ;
				var channel = ;
				var power = ;


				// Next we will search the database to see if we have seen this specific
				// network information before.  If we havent, then we will create a
				// new database object with the information we discovered and then inform
				// the WebUI of the new data.
				Network.findOne({
					where: {
						essid: essid,
						auth: auth,
						bssid: bssid
					}
				}).then(function(err, result) {
					if (!(result)) {
						Network.create({
							essid: essid,
							auth: auth,
							bssid: bssid,
							firstSeen: firstSeen,
							lastSeen: lastSeen,
							channel: channel,
							power: power 
						});
						console.log('Airdump-ng Network Added: Added ' + essid + '\t Auth Type: ' + auth);
						io.emit('networks', {
							essid: essid,
							auth: auth,
							bssid: bssid,
							firstSeen: firstSeen,
							lastSeen: lastSeen,
							channel: channel,
							power: power
						});
					}
				});
			}
		    }, config.Airmon.interval);}
		})

		child.stderr.on('data', function(data) {
			console.log('Airmon-ng: (stderr): ' + data.toString().replace(/(\r\n|\n|\r)/gm, ' '));
		})

		// If driftnet exists for some reason, log the event to the console
		// and then initiate a new instance to work from.
		child.on('close', function(code) {
			console.log('Airmon-ng: child terminated with code ' + code);
			child = run()
		})

		child.on('error', function(error) {
			console.log('Airmon-ng: Failed to start process');
		})
	}

	// Lets get this baby started!
	var child = run();
}


module.exports = { parser: airmonParser}

var ip = "192.168.1.0-254";
var arr = ip.split(".");
var oct = arr[0] + "." + arr[1] + "." + arr[2];
var range = arr[3].split("-")
var min = parseInt(range[0]);
var max = parseInt(range[1]);
for (var line=1; line<60; line++) {
	for(var i=min;i<max;i++) {
		var s = oct + "." + i;
	    document.write(s);
  		document.writeln("<br>");
  }
  }
