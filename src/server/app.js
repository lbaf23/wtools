var express = require('express');
var app = express();


app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8081");
  res.header("Access-Control-Allow-Headers", "content-type");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get('/socketio', function (req, res) {
  res.send('hhh')
});

var server = app.listen(3000, function () {
  console.log('listening... 3000')
});
