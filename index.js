var express = require('express');
var pug = require('pug');
var path = require('path');
var routes = require('./routes');
var bodyParser = require('body-parser');

var app = express();

app.set('view engine', 'pug');
app.set('views', __dirname+'/views');
app.use(express.static(path.join(__dirname+'/public')));

var urlencodedParser = bodyParser.urlencoded({
    extended: true
});

app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/signup', routes.signup);

app.get('/create', routes.create);
app.post('/create', urlencodedParser, routes.createUser)

app.get('/edit/:id', routes.edit);
app.post('/edit/:id', urlencodedParser, routes.editUser)

app.get('/delete/:id', routes.delete);

app.get('/details/:id', routes.details);

app.listen(3000);