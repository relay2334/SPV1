//This will be the parser for airmon-ng data
/*
Config file variables left to include:
Database Variables:
bssid: {type: Sequelize.STRING(190), unique: true, primaryKey: true},
channel: {type: Sequelize.INTEGER, defaultValue: 0},
auth: Sequelize.STRING,
essid: Sequelize.STRING,
power: {type: Sequelize.INTEGER, defaultValue: 0}
*/
var httpreq = require('httpreq');
var spawn = require('child_process').spawn;
var config = require('config');
var io = require('../web').io;
var Network = require('../models').Network;

function airmonParser() {

	function run() {
		console.log('Airmon-ng: Instantiating airodump-ng process.')

		var child = spawn('/opt/ShepardsPi/lib/parsers/airmonFormat.sh ' + config.Airmon.interface, [], {shell: '/bin/bash'});

		
		// Airdump-ng data capture...
		child.stdout.on('data', function(data) {
			var rdata = //REGEX
			var dataE = rdata.test(data.toString());
			if(dataE) {
				var raw = (data.toString()).split("*");
				var essid = raw[0];
				var auth = raw[1];
				var bssid = raw[2];
				var channel = raw[3];
				var power = raw[4];

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
							channel: channel,
							power: power 
						});
						console.log('Airdump-ng Network Added: Added ' + essid + '\t Auth Type: ' + auth);
						io.emit('networks', {
							essid: essid,
							auth: auth,
							bssid: bssid
							channel: channel,
							power: power
						});
					}
				});
			}//Network
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
