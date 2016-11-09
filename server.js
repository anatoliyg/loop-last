const express   = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Account = require('./models/account');

const routes = require('./routes/index');
// const users = require('./routes/users');

// setup express app
const app = express();
process.on('uncaughtException', (err) => {
  console.log(err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 9090;
// app.use('/api', routes)
app.use('/', routes);

// passport config
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

mongoose.connect('mongodb://localhost:27017/youtube');
mongoose.Promise = global.Promise;


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// // error handlers

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });



const server = app.listen(port, () => {
  console.log('server running on port', port);
});

const io = require('socket.io').listen(server);

io.sockets.on('connection', (socket) => {
  console.log('got the connection!!!!!');

  setTimeout(() => {
    socket.emit('news', { hello: 'world' });
  }, 1000);

  socket.on('EVENT_FROM_FRONT_END', (data) => {
    console.log(data);
  });
});




