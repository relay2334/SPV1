//This will be the parser for airmon-ng data


/*
These are the config file variables:
config.Airmon.interface
config.Airmon.airodump_autostart
config.Airmon.interval
config.Airmon.save_handshakes
config.Airmon.handshake_path
*/

var spawn = require('child_process').spawn;
var config = require('config');
var httpreq = require('httpreq');
var db = require('../models');
var md5 = require('md5');
var fs = require('fs');
var io = require('../web').io;

//TBD

