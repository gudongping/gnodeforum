const express = require('express');
const favicon = require('serve-favicon');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const serverRender = require('./util/server-render');

const isDev = process.env.NODE_ENV === "development"
const app = express();
app.use(favicon(path.join(__dirname,'../favicon.ico')));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
  maxAge: 10*60*1000, // 过期时间
  name: 'tid',   // cookieId
  resave: false, // 每次请求是否都生成cookieId
  saveUninitialized: false,
  secret: 'react cnode'
}));

app.use('/api/user', require('./util/handle-login'))
app.use('/api', require('./util/proxy'));

if(!isDev) {
  const template = fs.readFileSync(path.join(__dirname,'../dist/server.ejs'),"utf8");
  const serverEntry = require('../dist/server-entry');
  app.use('/public',express.static(path.join(__dirname,'../dist')));
  app.get('*', function(req, res, next) {
    serverRender(serverEntry, template,req, res).catch(next);
  });
} else {
  const devStatic = require('./util/dev-static');
  devStatic(app);
}

app.use(function(error, req, res, next) {
  console.log(error)
  res.status(500).send(error)
})

app.listen(3333, function () {
  console.log('server is listening on 3333');
});