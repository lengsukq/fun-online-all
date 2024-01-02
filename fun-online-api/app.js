require('dotenv').config({ path: `.env.local` });
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const webhooks = require('./routes/webhooks');
const verify = require('./routes/verify');
const logger = require('./logger');
const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});


app.get('/', function (req, res) {
    res.send({
        data: 'hello webhooks!'
    })
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/webhooks', webhooks);
app.use('/verify', verify);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler app错误处理
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
// 处理非404错误（throw出来的错误）
const _errorHandler = (err, req, res, next) => {
    logger.error(`${req.method} ${req.originalUrl}` + err.message)
    const errorMsg = err.message
    res.status(err.status || 500).json({
        code: -1,
        success: false,
        message: errorMsg,
        data: {}
    })
}
app.use(_errorHandler)

module.exports = app;
