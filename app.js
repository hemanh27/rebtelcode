const express = require("express");
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

var app = express();

// Load routes


/* Middlewares */
// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folders
app.use(express.static(path.join(__dirname,'public')));

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Express session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Flash Middleware
app.use(flash());

// Global Variables for Flash messaging
app.use(function(req,res,next){
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
   res.locals.user = req.user || null;
   next();
});

// Routing
// Index
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
      title: title
  });
});

app.post('/', (req, res) => {
    var selectedCountry = '';
    if(req.body.countryList != ''){
        selectedCountry = req.body.countryList;
    }
    if(req.body.searchCountry != ''){
        selectedCountry = req.body.searchCountry;
    }
    fetch('https://restcountries.eu/rest/v2/name/'+selectedCountry+'?fullText=true')
        .then(response => {
            return response.json();
        })
        .then(data1 => {
            res.render('index', {
                data: data1
            });
        });
});


// App Port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
