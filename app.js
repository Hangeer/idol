const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

/*
*   @modules
*       express
*       path
*       favicon 用于请求网页 favicon 的中间件 {serve-favicon}
*       logger 用于打印网页服务信息的 {morgan}
*       cookieParser 用于对 cookie 进行处理的中间件
*       bodyParser 用于解析 http 请求
* */

let routes = require('./routes/index');
let users = require('./routes/users');

/*
*   引入用户模块
* */

let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
/*
*   设置前端模板放置的文件夹
*   设置前端模板使用的模板语言 解析无需引入该模板 npm 下载即可
* */

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/*
*   logger 开发模式
*   express.static 设置静态文件目录
* */


app.use('/', routes);
app.use('/users', users);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
/*
*   错误处理
* */

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
/*
*   错误处理: 开发模式
* */

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
/*
 *   错误处理: 生产模式
 * */


module.exports = app;
