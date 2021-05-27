var express = require('express');
var expressReactViews = require('express-react-views');
var fs = require('fs');
var path = require('path');

var createError = require('http-errors');

var cookieParser = require('cookie-parser');
// request logger
var logger = require('morgan');

var indexRouter = require('./routes');

var app = express();

// view engine setup
var options = { beautify: true };
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jsx');
app.engine('jsx', expressReactViews.createEngine(options));

// log all request to STDOUT
// app.use(logger('dev')); 
// write logs to a file
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'dev.log'), { flags: 'a' })
app.use(logger(':method :url :status :res[content-length] - :response-time ms', {
  // skip: function (req, res) { return res.statusCode < 400 },
  stream: accessLogStream
}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter.index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
