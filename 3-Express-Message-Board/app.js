const express = require('express');
const path = require('path');
const router = require('./router');

const app = express();

// Use bodyparser 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Use router for root
app.use('/', router);

// Listen on port 8080
app.listen(8080);