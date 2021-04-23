const http = require('http');
const fs = require('fs');
const url = require('url');
const express = require('express');
const app = express();

// This server will return the correct HTML 
// or display a 404 html if it can't be found


app.get("/*", (req, res, next) => {
    let q = url.parse(req.url, true);
    let fileName;
    if (q.pathname != '/')
        fileName = "./html" + q.pathname + ".html";
    else
        fileName = "./html/index.html";

    res.sendFile(fileName, {root: __dirname}, (err) => {
        if (err)
            next();
    });
});

app.get("/*", (req, res) => {
    res.sendFile("./html/404.html", {root: __dirname});
});

app.listen(8080);