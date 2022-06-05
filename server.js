const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const render = require('./router/render');
const user = require('./router/user');
const member = require('./router/member');
const match = require('./router/match');
const message = require('./router/message');
const passport = require('passport');

const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./controller/formatDate')

require('dotenv').config();
require('./controller/googleAuth');

const app = express();
const server = http.createServer(app);
const transaction = require('./model/utility');

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
app.use('/api/user/match', match);
app.use('/api/user/message', message)

const PORT = 3000;
const HOST = '0.0.0.0';

// app.listen(PORT, HOST);
server.listen(PORT, HOST);
console.log('Server listen at port 3000...');

const io = socketio(server);


app.post('/history', async (req, res) => {
    const {sender, receiver} = req.body;
    // console.log(sender, receiver)
    const sql = ["SELECT sender, receiver, message, time FROM message WHERE sender = ? AND receiver = ? OR sender = ? AND receiver = ?"];
    const value = [[sender, receiver, receiver, sender]]
    const data = await transaction(sql, value);
    const message = data[0];
    // console.log(message)

    const senderData = await transaction(["SELECT image, username FROM member WHERE email = ?"], [[sender]])
    const receiverData = await transaction(["SELECT image, username FROM member WHERE email = ?"], [[receiver]])
    // console.log(imgData[0])
    const imgResponse = {};
    imgResponse[sender] = senderData[0][0];
    imgResponse[receiver] = receiverData[0][0];
    // console.log('re=',imgResponse)
    res.status(200).json({'people': imgResponse, 'data': message})
})

app.post('/people', async (req, res) => {
    const {userId, friendId} = req.body;
    const data = await transaction(["SELECT username, email, image FROM member WHERE id = ?"], [[userId]]);
    const {username, email, image} = data[0][0]

    const friendData = await transaction(["SELECT email FROM member WHERE id = ?"], [[friendId]]);
    const friendEmail = friendData[0][0]['email']

    const response = {
        'sender': email,
        'username': username,
        'image': image,
        'receiver': friendEmail
    }
    res.status(200).json({'success': true, 'data': response})
})

const users = [];
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('user_connected', async (userId, friendId) => {
        const data = await transaction(["SELECT email FROM member WHERE id = ?"], [[userId]]);
        const {email} = data[0][0]

        users[email] = socket.id;
    })

    socket.on('send_message', async (data) => {
        // console.log(data)
        const id = users[data.receiver];
        const imgData = await transaction(["SELECT image, username FROM member WHERE email = ?"], [[data.sender]]);
        const {image, username} = imgData[0][0];
        const response = formatMessage(data, image, username);

        io.to(id).emit('new_message', response)
        await transaction(["INSERT INTO message (sender, receiver, message, time) VALUES (?, ?, ?, ?)"], [[data.sender, data.receiver, data.message, data.time]])
    })
})