//This will be the parser for airmon-ng data


/*
Config file variables:
config.Airmon.interface
config.Airmon.airodump_autostart
config.Airmon.interval
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

//TBD

