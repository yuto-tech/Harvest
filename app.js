'use strict';

const debug = require('debug');
const debugInfo = debug('module:info');
setInterval(() => {
  debugInfo('some information.');
}, 1000);
const debugError = debug('module:error');
setInterval(() => {
  debugError('some error.');
}, 1000);


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var session = require('express-session');
var passport = require('passport');


// モデルの読み込み
var User = require('./models/user');
var fanding = require('./models/fanding');
var Counter = require('./models/view-counter');
User.sync().then(() => {
  fanding.belongsTo(User, {foreignKey: 'createdBy'});
  fanding.sync();
  Counter.belongsTo(User, {foreignKey: 'userId'});
  Counter.sync();
  fanding.sync().then(() => {
    Counter.belongsTo(fanding, {foreignKey: 'titleID'});
    Counter.sync();
  });
  Counter.sync().then(() => {
    fanding.belongsTo(Counter, {foreignKey: 'titleID'});
  fanding.sync();
  });
});


var GitHubStrategy = require('passport-github2').Strategy;
var GITHUB_CLIENT_ID = GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID ||'6e8a80efee03d585041f';
var GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET ||'a89e919243f71e3319129a9f2318bcf5c4f69905';

passport.serializeUser(function (user, done) {
  done(null, user);
});
  
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
  
passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL:  process.env.HEROKU_URL ? process.env.HEROKU_URL + 'auth/github/callback' :'http://localhost:8000/auth/github/callback'
},
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      User.upsert({
        userId: profile.id,
        username: profile.username,
        image_name: `${profile.id}.jpg`
      }).then(() => {
        done(null, profile); 
      });
    });
  }
));

var indexRouter = require('./routes/index');
var photosRouter = require('./routes/photos');
var fandRouter = require('./routes/fand');
var serverStatus = require('./routes/server-status');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var UploadRouter = require('./routes/upload');
var CountRouter = require('./routes/View-count');

const { permittedCrossDomainPolicies } = require('helmet');

var app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(session({ secret: 'c1ea430a07a96954', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/photos', photosRouter);
app.use('/fand', fandRouter);
app.use('/server-status', serverStatus);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/upload', UploadRouter);
app.use('/View-count', CountRouter);

app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  function (req, res) {
});

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    var loginFrom = req.cookies.loginFrom;
    // オープンリダイレクタ脆弱性対策
    if (loginFrom &&
      !loginFrom.includes('http://') &&
      !loginFrom.includes('https://')) {
      res.clearCookie('loginFrom');
      res.redirect(loginFrom);
    } else {
      res.redirect('/');
    }
});

app.get('/Setting', (req, res) => {
  res.render('Setting.ejs');
});

app.get('/output', (req, res) => {
  res.render('output.ejs');
});

app.get('/support', (req, res) => {
  res.render('support.ejs');
});

app.get('/practice', (req, res) => {
  res.render('practice.ejs');
});

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
