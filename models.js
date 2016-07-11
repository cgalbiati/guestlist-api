var DATABASE = process.env.DB_NAME || 'guestlist';
var USERNAME = process.env.DB_USERNAME || 'chandragalbiati';
var PASSWORD = process.env.DB_PASSWORD || "";
var Sequelize = require('sequelize');

// postgres://[username]:[password]@[host]:[port]/[databaseName]

var seq = new Sequelize(DATABASE, USERNAME, PASSWORD, {
  host: process.env.DB_HOST ||'localhost',
  //COMMENT OUT PORT LINE if this doesn't work on local machine, it's not needed for local
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  define: {
    freezeTableName: true,
    underscored: true,
    underscoredAll: true
  }
});

seq
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  }, function (err) { 
    console.log('Unable to connect to the database:', err);
  });


var Guest = seq.define('guest', {
  name: Sequelize.STRING,
  status: Sequelize.ENUM('yes', 'no', 'unconfirmed'),
  address: Sequelize.TEXT,
  code: Sequelize.STRING,
  phone: Sequelize.STRING,
  diet: Sequelize.STRING,
  inviter: Sequelize.STRING,
  group: Sequelize.STRING
});

// var DietaryRest = seq.define('dietaryrest', {
//   type: Sequelize.STRING,
//   default: Sequelize.BOOLEAN
// });


// guest
// name, 
// status: emum: going, not, unconfirmed
// address: str
// phone: str
// code: str/fk *index*


//diet: 
// restriction, default

// join table: guest, dr


//starts database
// seq.sync()

module.exports = {
  seq: seq,
  Guest: Guest
};