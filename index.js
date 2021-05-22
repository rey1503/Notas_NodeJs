const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bodyParser = require('body-parser');
const passport = require('passport');
var flash = require('connect-flash');
const PassportLocal = require('passport-local').Strategy;
const app = express();
require('dotenv').config();
require('./base');
app.set(' view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use (flash ());
app.use(cookieParser('palabra'));
app.use(session({
secret: 'palabra',
cookie:{maxAge:100000},
resave: true,
saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

    app.use(require('./routers'));
module.exports= app;
app.listen(5800, () => {
  console.log('corriendo el servidor' + ' 5800');
}); 

