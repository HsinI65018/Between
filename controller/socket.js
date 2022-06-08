const SocketIo = require('../model/socket');
const Formate = require('./formatData');

const socketIo = new SocketIo();
const formate = new Formate()

const users = [];
function initSocket(io){
    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('user_connected', async (userId) => {
            console.log('prev=',users)

            const data = await socketIo.getUserEmail(userId);
            const { email } = data[0][0]

            users[email] = socket.id;
            console.log('users=',users)
        })

        socket.on('send_message', async (data) => {
            // console.log(data)
            const id = users[data.receiver];
            const userData = await socketIo.getUserInfo(data.sender)
            const { image, username } = userData[0][0];
            const response = formate.formateMessage(data, image, username)

            io.to(id).emit('new_message', response)
            await socketIo.createUserMessage(data.sender, data.receiver, data.message, data.time)
        })

        socket.on('disconnect', () => {
            console.log('a user disconnected');
            // const user = socket.id;
            // console.log(user)
        })
    })
}


module.exports = initSocket;