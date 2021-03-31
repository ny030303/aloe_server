var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const session = require('express-session');
var morgan = require('morgan');
const dotenv = require('dotenv');
const passport = require('passport');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const {connect} = require('./models');
const passportConfig = require('./passport');


var app = express();

// view engine setup
passportConfig(); // 패스포트 설정

app.set('port', process.env.PORT || 54000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
connect();

app.use(morgan('dev'));


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
// app.use(bodyParser.urlencoded({extended: false}));

app.use('/', indexRouter);
app.use('/user', usersRouter);

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
