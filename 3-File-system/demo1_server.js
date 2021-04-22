var http = require('http');
var fs = require('fs');

// This server will log every request (except for favicon) in a file
// and delete the log file when visiting the URL /delete

http.createServer(function(req, res) {
    if (req.url == '/favicon.ico') {
        res.writeHead(404);
        return res.end();
    }

    let d = new Date;
    let reqTxt = "Requested url \'" + req.url + "\' at " + d.toTimeString().slice(0, 8) + '\n';
    fs.appendFile('./entry_log.txt', reqTxt, function (err) {
        if (err)
            throw err;
    });

    if (req.url == '/delete') {
        fs.unlink('./entry_log.txt', function (err) {
            if (err)
                throw err;
        });
    }

    fs.readFile('./demo1.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
}).listen(8080);