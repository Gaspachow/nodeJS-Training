var http = require('http');
var fs = require('fs');
var url = require('url');
var uc = require('upper-case');
var events = require('events');

// Setting up event that displays in console every time server gets request
eventEmitter = new events.EventEmitter();

function requestHandler() {
    console.log(uc.upperCase('A request event was triggered!'));
    return;
}

eventEmitter.on('serverRequested', requestHandler);


// This server will return the correct HTML 
// or a 404 if it can't be found
http.createServer(function(req, res) {
    eventEmitter.emit('serverRequested');
    let q = url.parse(req.url, true);
    let fileName;
    if (q.pathname != '/')
        fileName = "html" + q.pathname + ".html";
    else
        fileName = "html/home.html";

    fs.readFile(fileName, function(err, data) {
        if (err){
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end(uc.upperCase("404 Not Found"));
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
}).listen(8080);