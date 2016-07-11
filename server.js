'use strict'

var express = require('express');
var app = express();
var http = require('http').Server(app);
var sequelize = require('sequelize');

var seq = require('./models').seq;
var Guest = require('./models').Guest;
// var EventModel = require('./database').EventModel;
// var Promise = require('bluebird');
var PORT = process.env.PORT || 3000;


// app.use(express.static(__dirname+"/public/"));

// app.get('/', function(req, res){
//   console.log('hi')
//   res.sendFile(__dirname + '/index.html');
// });

app.get('/')

//gets events from a year
//query strings will be in the format: ?limit=__
app.get('/api/guest/:code', function(req, res){
  return Guest.findAll({
    where: {
      code: req.query.code
    },
    attributes: ['name', 'status', 'diet']
  });
});

app.post('/api/rsvp', function (req, res) {
  //update where code and name
  //find by code and name?
})

//query strings will be in the format: ?min=__&max=__&perYear=__
app.get('/api/range', function(req, res){
  var min = parseInt(req.query.min, 10);
  var max = parseInt(req.query.max, 10);
  var perYear = req.query.perYear || 3;
  var queryString = buildRangeQuery(min, max, perYear);
  //query database to get first perYear events from each year between min and max
   return seq.query(queryString, { type: sequelize.QueryTypes.SELECT})
  .then(function(events) {
    return res.send(events);
  }).catch(function(err){
    console.error('error getting events in range', err);
  });
});

//post/mock-post routes 
//un-comment to allow database-filling requests
// var postRouter = require('./fill-db-routes');
// app.use('/api/post', postRouter);

//connect to db and start server
//one of the seq.sync statements should always be commented out.  The first resets the db, and the second does not
// seq.sync({force:true})
seq.sync()
.then(function(){
  http.listen(PORT, function(){
    console.log('listening on', PORT);
  });
});

module.exports = {
  PORT: PORT
};

function buildRangeQuery(min, max, limit){
  var queryString = '';
  for(var year = min; year<=max; year++){
    queryString += "(select year, score, text from event where year = '" + year + "' order by score desc limit " + limit + ") ";
    if (year<max) queryString += "union all ";
  }
  return queryString;
}

function parseYear(yearStr){
  var bc = yearStr.search(bcRE);
  var year;
  if(bc>-1){
    year = 0 - parseInt(yearStr, 10);
  } else year = Number(yearStr);
  if(isNaN(year)) year = 1900;
  return year.toString();
}


