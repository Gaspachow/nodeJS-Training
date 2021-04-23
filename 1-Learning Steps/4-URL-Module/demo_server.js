var http = require('http');
var fs = require('fs');
var url = require('url');

// This server will return the correct HTML 
// or a 404 if it can't be found

http.createServer(function(req, res) {
    let q = url.parse(req.url, true);
    let fileName;
    if (q.pathname != '/')
        fileName = "." + q.pathname + ".html";
    else
        fileName = "./home.html";

    fs.readFile(fileName, function(err, data) {
        if (err){
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
}).listen(8080);