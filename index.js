var express = require('express');
var mongoose = require('mongoose'); 
var path = require('path');
var keys = require('./keys');
var postRouter = require('./routes/post.js');  
var app = express();
var bodyParser = require('body-parser');
app.use('/', express.static(__dirname + '/public'));

var myLogger = function (req, res, next) {
  console.log(__dirname + '/public');
  next();
};
var myLogger2 = function (req, res, next) {
  console.log('LOGGED_2');
  next();
};

app.use(myLogger);
app.use(bodyParser.json({
    extended: true
}));
app.use(bodyParser.json());
app.use('/api/post',postRouter);


mongoose.connect(keys.mongoURI)
	.then(() => console.log('MongoDB connected.'))
	.catch(err => console.log(err))

app.get('/a', function (req, res) {
  console.log('get erty');
  res.end();

});

app.post('/', function (req, res) {
  res.send('POST');
});

app.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});