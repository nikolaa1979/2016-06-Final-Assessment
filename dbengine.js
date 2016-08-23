var path = require('path');
var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, './db/giphy.sqlite')
  },
  useNullAsDefault: true
});
var db = require('bookshelf')(knex);


db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.string('username', 255).primary();
      user.string('password', 255);
      user.string('code', 100);
      user.timestamps();
     
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

/************************************************************/
// Add additional schema definitions below
/************************************************************/


module.exports = db;