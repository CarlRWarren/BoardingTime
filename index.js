var express = require('express');
var pug = require('pug');
var path = require('path');
var routes = require('./routes');
var bodyParser = require('body-parser');
var expressSession = require('express-session');

var app = express();

const checkAuth = (req, res, next) => {
  if(req.session.user && req.session.user.isAuthenticated){
    next();
  }else{
    res.redirect('/');
  }
}
const checkAdmin = (req, res, next) => {
  if(req.session.user && req.session.user.isAuthenticated && req.session.user.isAdmin){
    next();
  }else{
    res.redirect('/');
  }
}

app.set('view engine', 'pug');
app.set('views', __dirname+'/views');
app.use(express.static(path.join(__dirname+'/public')));

app.use(expressSession({
  secret: 'Whatever54321',
  saveUninitialized: true,
  resave: true
}));

var urlencodedParser = bodyParser.urlencoded({
    extended: true
});

app.get('/', routes.index);
app.get('/login', routes.login);
app.post('/login', urlencodedParser, routes.loginUser);

app.get('/signup', routes.signup);
app.post('/signup', urlencodedParser, routes.signupUser);
app.get('/logout', routes.logout);

app.get('/admin', checkAdmin, routes.admin);

app.get('/edit/:id', routes.edit);
app.post('/edit/:id', urlencodedParser, routes.editUser)

app.get('/delete/:id', routes.delete);

app.get('/details/:id', routes.details);

app.get('/showAll', routes.showAll);

app.listen(3000);