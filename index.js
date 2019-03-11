var express = require('express');
var pug = require('pug');
var path = require('path');
var routes = require('./routes');
var bodyParser = require('body-parser');
var expressSession = require('express-session');

var app = express();

const checkAuth = (req, res, next) => {
  if (req.session.user && req.session.user.isAuthenticated) {
    next();
  } else {
    res.redirect('/');
  }
}

const checkAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.isAuthenticated && req.session.user.isAdmin) {
    next();
  } else {
    res.redirect('/');
  }
}

const checkNotAuth = (req, res, next) => {
  if (!req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
}

const checkAuthNotAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.isAuthenticated && !req.session.user.isAdmin) {
    next();
  } else {
    res.redirect('/');
  }
}

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname + '/public')));

app.use(expressSession({
  secret: 'Whatever54321',
  saveUninitialized: true,
  resave: true
}));

var urlencodedParser = bodyParser.urlencoded({
  extended: true
});

app.get('/', routes.index);

app.post('/postmessage', urlencodedParser, checkAuth, routes.postMessage);
app.get('/deletemessage/:id', urlencodedParser, checkAuth, routes.deleteMessage);

app.get('/editmessage/:id', checkAuth, routes.editMessage);
app.post('/editmessage/:id', urlencodedParser, checkAuth, routes.editMessagePost);

app.get('/login', checkNotAuth, routes.login);
app.post('/login', urlencodedParser, checkNotAuth, routes.loginUser);

app.get('/signup', checkNotAuth, routes.signup);
app.post('/signup', urlencodedParser, checkNotAuth, routes.signupUser);

app.get('/logout', checkAuth, routes.logout);

app.get('/admin', checkAdmin, routes.admin);

app.get('/edit', checkAuth, routes.edit);
app.post('/edit', checkAuth, urlencodedParser, routes.editUser);

app.get('/delete', checkAuth, routes.delete);
app.get('/delete/:id', checkAdmin, routes.delete);

app.listen(3000);