/**
 * =============================
 * IMPORTS
 * ============================
 */

var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


/**
 * =============================
 * EXPRESS APP IMPORTS
 * ============================
 */

var express = require('express');
var mongoose = require('mongoose');
var app = express();
var config = require('./config');
var cors = require('cors');
var router = express.Router();

/**
 * =============================
 * ENGINE SETUP
 * ============================
 */

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
//Allow unauthorized TLS certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

/**
 * =============================
 * ROUTES DEFINITION
 * ============================
 */
app.use('/', require('../routes/index'));
app.use('/orders', require('../routes/controller/orderController'));
app.use('/products', require('../routes/controller/productController'));
app.use('/users', require('../routes/controller/userController'));

/**
 * Middleware
 */
// middleware to use for all requests
router.use(function (req, res, next) {
  // do logging
  console.log('Something is happening -->');
  next(); // make sure we go to the next routes and don't stop here
  console.log(' CHECK ');
});

/**
 * =============================
 * ERROR HANDLERS
 * ============================
 */

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

 /**
 * =============================
 * MONGO DB CONNECTION
 * ============================
 */

mongoose.connect(config.database, { useNewUrlParser: true }).catch((err) => console.error(err));
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
  console.log("We're connected!");
  console.log("====================================");
  console.log("IF YOU'RE LOCAL : http://localhost:8080");
  console.log("====================================");
})
mongoose.Promise = global.Promise;

/**
 * =============================
 * END
 * ============================
 */
module.exports = app;
