import * as express from 'express'
import * as http from 'http'
import * as _io from 'socket.io'

export async function startServer() {
  const app = express

  const server = http.createServer(app)
  const io = _io(server)

  io.on('connection', (socket) => {
    console.log('User connected via socketio')

    socket.on('data', (data: string) => {
      console.log('Received data: ', data)
    })
  })

  server.listen(8000, () => {
    console.log('Server running on 8080')
  })
}

startServer()
