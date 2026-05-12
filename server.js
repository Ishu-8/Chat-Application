const express = require('express')
const app = express()
const http = require('http')
const path = require('path')

let server = http.createServer(app)

const io = require('socket.io')(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
})

app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// ── Track all online members: socketId → username ──
const onlineMembers = new Map()

io.on('connection', function (socket) {
  console.log('New connection:', socket.id)

  // User joins → store them, send existing members list to newcomer, tell everyone else
  socket.on('login', (data) => {
    onlineMembers.set(socket.id, data.user)
    console.log('Online members:', [...onlineMembers.values()])

    // Send the CURRENT member list (excluding self) to the new user
    const currentMembers = [...onlineMembers.values()].filter(name => name !== data.user)
    socket.emit('current_members', { members: currentMembers })

    // Tell everyone else this new user joined
    socket.broadcast.emit('receive_user', { user: data.user })
  })

  // Message broadcast
  socket.on('send_message', (data) => {
    socket.broadcast.emit('receive_message', data)
  })

  // Manual logout
  socket.on('logout', (data) => {
    onlineMembers.delete(socket.id)
    socket.broadcast.emit('userLogout', { user: data.user })
  })

  // Browser closed / disconnected
  socket.on('disconnect', () => {
    const name = onlineMembers.get(socket.id)
    if (name) {
      onlineMembers.delete(socket.id)
      socket.broadcast.emit('userLogout', { user: name })
      console.log(`${name} disconnected`)
    }
  })
})

server.listen(process.env.PORT || 3000, () => {
  console.log('✅ Chattr running at http://localhost:3000')
})
