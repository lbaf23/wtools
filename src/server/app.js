var express = require('express');
var apiRoutes = express.Router();
var app = express();

app.use('/api', apiRoutes);

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

console.log(global.baseUrl);
var server;
server = app.listen(global.port, function () {
  console.log('listening... ', global.port)
});
