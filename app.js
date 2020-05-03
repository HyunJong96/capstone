var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var logger = require('morgan');
const db = require('./public/db')
const methodOverride = require('method-override')
var flash = require('connect-flash')
var session = require('express-session')
var passport = require('./config/passport')
var mongoose = require('mongoose')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeRouter = require('./routes/home')
var postRouter = require('./routes/post')

var app = express();
db()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(methodOverride('_method'))
app.use(flash())
app.use(cookieParser())
app.use(session({//session생성 코드
  secret:'Mysecret',
  resave:false,  //session을 언제나 저장할지 정하는 값.(express-session에서는 false를 권장)
  saveUninitialized:true,  //session저장되기 전에 uninitialized상태로 미리 만들어서 저장한다.
  store:require('mongoose-session')(mongoose)
}))

app.use(passport.initialize())  //passport를 초기화 시켜주는 함수
app.use(passport.session())  //passport를 session과 연결해 주는 함수
app.use(function(req,res,next){ 
  res.locals.isAuthenticated = req.isAuthenticated()
  console.log('currentUser : ',req.user)
  console.log('session 확인 >>> ',req.session)
  res.locals.currentUser = req.user
  next()
})


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/homepage',homeRouter)
app.use('/posts',postRouter)

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
