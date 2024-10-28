const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(express.static('public'));

let users = {};
let messages = [];

io.on('connection', (socket) => {
    socket.on('login', (username) => {
        users[socket.id] = username;
        socket.emit('messageHistory', messages);
    });

    socket.on('sendMessage', (message) => {
        const msg = { user: users[socket.id], text: message };
        messages.push(msg);
        io.emit('newMessage', msg);
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
