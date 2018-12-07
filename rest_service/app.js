var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var stopsRouter = require('./routes/stops');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/v1/stop', stopsRouter);
app.use(errorHandler)

function errorHandler (err, req, res, next) {
    if (res.headersSent) {
        return next(err)
      }

      err.code = err.code ? err.code : 500

      res.status(err.code)
      res.json({code: err.code, 'description': err.message})
  }


module.exports = app;
