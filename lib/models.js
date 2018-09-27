var Sequelize = require('sequelize');
var base64Img = require('base64-img');
var config = require('config');
var sequelize = new Sequelize(config.Database.uri, {logging: config.Database.logging});


var Image = sequelize.define('image', {
	id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
	hash: Sequelize.STRING(32),
	count: {type: Sequelize.INTEGER, defaultValue: 0},
	url: Sequelize.STRING,
	filename: {type: Sequelize.STRING(42), unique: true},
	date: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
	nsfw: {type: Sequelize.INTEGER} 
},{
	instanceMethods: {
		b64: function() {
			return base64Img.base64Sync(config.AppServer.images + '/' + this.filename);
		}
	}
})

var Account = sequelize.define('account', {
	id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
	username: Sequelize.STRING,
	password: Sequelize.STRING,
	information: Sequelize.STRING,
	protocol: Sequelize.STRING,
	parser: Sequelize.STRING,
	dns: Sequelize.STRING
})

var Stat = sequelize.define('stat', {
	id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
	date: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
	count: {type: Sequelize.INTEGER, defaultValue: 0},
	transport: Sequelize.STRING
})

var Host = sequelize.define('host', {
	name: {type: Sequelize.STRING(190), unique: true, primaryKey: true},
	date: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
	count: {type: Sequelize.INTEGER, defaultValue: 0}
})

//First attempt at network object
var Network = sequelize.define('network', {
	bssid: {type: Sequelize.STRING(190), unique: true, primaryKey: true},
	firstSeen: Sequelize.DATE,
	lastSeen: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
	channel: {type: Sequelize.INTEGER, defaultValue: 0},
	auth: Sequelize.STRING,
	essid: Sequelize.STRING,
	power: {type: Sequelize.INTEGER, defaultValue: 0}
})


Image.sync();
Account.sync();
Stat.sync();
Host.sync();
Network.sync();


module.exports = {
	Account: Account,
	Image: Image,
	Stat: Stat,
	Host: Host,
	Network: Network,
	sequelize: sequelize
}
