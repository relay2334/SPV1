//This will be the parser for airmon-ng data
/*
Config file variables left to include:
config.Airmon.save_handshakes
config.Airmon.handshake_path

Database Variables:
bssid: {type: Sequelize.STRING(190), unique: true, primaryKey: true},
firstSeen: Sequelize.DATE,
lastSeen: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
channel: {type: Sequelize.INTEGER, defaultValue: 0},
auth: Sequelize.STRING,
essid: Sequelize.STRING,
power: {type: Sequelize.INTEGER, defaultValue: 0}
*/
var spawn = require('child_process').spawn;
var config = require('config');
var httpreq = require('httpreq');
var db = require('../models');
var md5 = require('md5');
var fs = require('fs');
var io = require('../web').io;

function airmonParser() {

	function run() {
		console.log('Airmon-ng: Instantiating airodump-ng process.')

		var child = spawn('airodump-ng /*ARGUMENTS*/ ' + config.Airmon.interface, [], {shell: '/bin/bash'});

		// Airmon data capture...
		while (true) {
      setTimeout(function(){
        child.stdout.on('data', function(data) {
			    //Normal Scanning
          
          //SAVE Handshakes
          
          
		    })
      }, config.Airmon.interval);
    }

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
