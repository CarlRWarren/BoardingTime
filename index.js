var express = require('express');
var pug = require('pug');
var path = require('path');
var routes = require('./routes.js');
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

app.get('/create', routes.create);
app.post('/create', urlencodedParser, routes.createPerson)

app.get('/edit/:id', routes.edit);
app.post('/edit/:id', urlencodedParser, routes.editPerson)

app.get('/delete/:id', routes.delete);

app.get('/details/:id', routes.details);

app.listen(3000);