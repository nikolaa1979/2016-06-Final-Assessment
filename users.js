var db = require('./dbengine');
var User = require('./user');

var Users = new db.Collection();

Users.model = User;

module.exports = Users;