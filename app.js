const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose=require('mongoose');

var dotenv = require('dotenv');
dotenv.config();

const session = require('express-session');
const nocache = require("nocache");

const adminRouter = require('./routes/admin');
const usersRouter = require('./routes/users');
const hbs=require('express-handlebars');

const connectDatabase = require('./config/connection')


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials',


helpers: {
  inc: function (value,context) {
    return parseInt(value) + 1;
  },
  formatString(date) {
    newdate = date.toUTCString()
    return newdate.slice(0, 16)
  },
  total: function (amount, discount, quantity) {
    return (amount - discount) * quantity;
  },
  singleTotal: function (amount, discount) {
    return (amount - discount);
  }
} 
}));








app.use(nocache());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(
  session({
   
    secret: "somerandonstuffs",
    resave: false,
    saveUninitialized: false,
   
  })
);



app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});
 

app.use('/', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
 // next(createError(404));
 res.render('error',{layout:'signup-layout'});
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{layout:'signup-layout'});
});

module.exports = app;
