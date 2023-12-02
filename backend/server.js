const express = require('express');
var cors = require('cors')
const app = express()
const path = require("path");

app.use(cors())
require('dotenv').config()


app.use(express.json())    // <==== parse request body as JSON


// --------------------------Deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/frontend/build")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
    })
} else {
    app.get('/', (req, res) => {
        res.send('Api is Running...')
    })
}

// --------------------------Deployment------------------------------

const port = process.env.PORT || 5000;


const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// --------------------------Socket IO------------------------------

const io = require("socket.io")(server, {
    pingTimeout: 6000,
    cors: {
    origin: "http://localhost:3000",
    },
})

// Create a users map to keep track of users
const users = new Map();

io.on('connection', socket => {
    console.log(`user connected: ${socket.id}`);
    users.set(socket.id, socket.id);

    // emit that user has joined as soon as someone joins
    socket.emit('user:joined', socket.id);

    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("callUser", { signal: signalData, from, name });
    });

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal)
    });
});

app.get('/users', (req, res) => {
    return res.json(Array.from(users));
});
