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



// const users = [];
// io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('user_connected', async (userId) => {
//         console.log('prev=',users)
//         const data = await transaction(["SELECT email FROM member WHERE id = ?"], [[userId]]);
//         const {email} = data[0][0]

//         users[email] = socket.id;
//         console.log('users=',users)
//     })

//     socket.on('send_message', async (data) => {
//         // console.log(data)
//         const id = users[data.receiver];
//         const imgData = await transaction(["SELECT image, username FROM member WHERE email = ?"], [[data.sender]]);
//         const {image, username} = imgData[0][0];
//         const response = formate.formateMessage(data, image, username)

//         io.to(id).emit('new_message', response)
//         await transaction(["INSERT INTO message (sender, receiver, message, time) VALUES (?, ?, ?, ?)"], [[data.sender, data.receiver, data.message, data.time]])
//     })

//     socket.on('disconnect', () => {
//         console.log('a user disconnected');
//         // const user = socket.id;
//         // console.log(user)
//     })
// })