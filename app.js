const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const dotenv = require('dotenv');
const passport = require('passport');
const cors = require('cors');
const bodyParser = require('body-parser');
const flash = require('connect-flash');


dotenv.config();
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const groupRouter = require('./routes/group');

const {connect} = require('./models');


const app = express();

app.set('port', process.env.PORT || 54000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
connect();

app.use(morgan('dev'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET, { sameSite: "none", secure: true }));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
// const cors = require('cors');

app.use(cors({
  origin: true,
  credentials: true
}));
// app.use(bodyParser.urlencoded({extended: false}));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/auth', authRouter);
app.use('/group', groupRouter);


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

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser( (user, done) => {
  done(null, user);
  // db.users.find({'id': user.id}).then(function(exUser) {
  //   console.log(exUser);
  //   // done(err, exUser[0]);
  // });
});
module.exports = app;
