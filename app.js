const express = require('express')
const app = express()
const server = require('http').createServer(app)
const PORT = process.env.PORT || 8045
const path = require('path')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const io = require('socket.io')(server)

const chats = require('./routes/chats')


//Congfiguração da engine
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//Configuração do Body-Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//Acessório ao diretório
app.use(express.static(path.join(__dirname, 'public')))

//Rota Principal
app.get('/', (req, res) => {
    res.render('index')
})

app.use('/chat', chats)

let messages = []
var usuarios = 0


/*let counter = 0
setInterval(() => {
    io.emit('msg',counter++)
}, 1000);*/


io.sockets.on('connection', (socket) => {

    socket.on('room', function(room) {
        socket.join(room);
    });

    room = "ana"
        //console.log(room)

    usuarios++

    io.emit('usuarios online', usuarios)

    socket.emit('previousMessage', messages)

    socket.on('sendMessage', data => {
        messages.push(data)
        socket.emit('receivedMessage', data)
            //console.log(data)
    })

    socket.on("typing", function(data) {
        socket.broadcast.to(room).emit("typing", data);
    });

    socket.on("not-typing", function(data) {
        socket.broadcast.to(room).emit("not-typing", data);
    });

})

server.listen(PORT, () => {
    console.log('Servidor iniciado...')
})