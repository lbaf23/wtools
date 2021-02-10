var fs = require('fs');

var data = fs.readFileSync(`${__dirname}/config.json`).toString();
var config = JSON.parse(data);

var port = config['server']['port'];

if(port === null)
    port = '3000';

var baseUrl = 'http://localhost:'+port.toString();

export default {
    port,
    baseUrl
}
