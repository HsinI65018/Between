const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const render = require('./router/render');
const user = require('./router/user');
const passport = require('passport');
require('dotenv').config();
require('./controller/auth');

const app = express();

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.static('./public'));
app.use(express.json());

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', render);
app.use('/api/user', user);

const PORT = 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST);
console.log('Server listen at port 3000...');