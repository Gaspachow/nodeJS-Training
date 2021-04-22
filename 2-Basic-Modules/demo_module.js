var http = require('http');
var dt = require('./myfirstmodule');
var url = require('url');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("Current <b>UNIX</b> timestamp in seconds is: " + dt.unixTime());
    res.write("<br>");
    let q = url.parse(req.url, true).query;
    res.write("URL Query list is: " + JSON.stringify(q));
    res.end();
}).listen(8080);