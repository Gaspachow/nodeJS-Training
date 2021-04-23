var http = require('http');
var fs = require('fs');
var url = require('url');

// This server will return the correct HTML 
// or display a 404 html if it can't be found
http.createServer(function(req, res) {
    let q = url.parse(req.url, true);
    let fileName;
    if (q.pathname != '/')
        fileName = "html" + q.pathname + ".html";
    else
        fileName = "html/index.html";

    fs.readFile(fileName, function(err, data) {
        if (err){
            fs.readFile("html/404.html", function(err, data) {
                if (err){
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    return res.end("Error connecting to the server");
                }
    
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            });
            return;
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
}).listen(8080);