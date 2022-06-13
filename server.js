const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const render = require('./router/render');
const user = require('./router/user');
const member = require('./router/member');
const candidate = require('./router/candidate')
const match = require('./router/match');
const message = require('./router/message');
const passport = require('passport');

const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const initSocket = require('./controller/socket');

require('dotenv').config();
require('./controller/googleAuth');

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.static('./public'));
app.use(express.json());

app.use(session({ secret: process.env.SESSION_SECRET_KEY, resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', render);
app.use('/api/user', user);
app.use('/api/user/profile', member);
app.use('/api/user/candidate', candidate);
app.use('/api/user/match', match);
app.use('/api/user/message', message)

const io = socketio(server);
initSocket(io)

const PORT = 3000;
const HOST = '0.0.0.0';

server.listen(PORT, HOST);
console.log('Server listen at port 3000...');