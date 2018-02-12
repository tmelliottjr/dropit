let express = require('express')
let path = require('path')
let favicon = require('serve-favicon')
let logger = require('morgan')
let cookieParser = require('cookie-parser')
let csrf = require('csurf');
let bodyParser = require('body-parser')
let config = require('./config/config')
let passport = require('passport')
let flash = require('connect-flash')
let session = require('express-session')
let mailer = require('express-mailer')
let compression = require('compression');
let app = express()

require('./config/passport')(passport)
require('./config/email')(mailer, app)

app.use(session({
  secret: config.appSecret,
  resave: false,
  saveUninitialized: true
}));

app.use(compression());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// Routes
let index = require('./routes/index');
let register = require('./routes/register');
let login = require('./routes/login');
let reset = require('./routes/reset');
let forgot = require('./routes/forgot');
let api = require('./routes/api');
let verify = require('./routes/verify');
let logout = require('./routes/logout');
let uploads = require('./routes/uploads');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.set('passport', passport);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, '/src/static')));

// Globals
app.use(function (req, res, next) {
  res.locals.config = config;
  next();
});

app.use('/', index);
app.use('/api', api);
app.use('/verify', verify);
app.use('/logout', logout);
app.use('/uploads', uploads);

// CSRF Protected
app.use(csrf({cookie: true}));

app.use('/register', register);
app.use('/login', login);
app.use('/reset', reset);
app.use('/forgot', forgot);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Page Not Found');
  err.status = 404;
  next(err)
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in developmentres.locals.config = "Test";
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' || err.status === 404 ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  console.log(err)
});

module.exports = app;
