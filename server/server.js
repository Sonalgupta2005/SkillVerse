require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:8080','https://skill-verse-vert.vercel.app'],
    credentials: true,
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('User connected to socket:', socket.id);

  socket.on('joinChat', (swapId) => {
    socket.join(swapId);
    console.log(`Socket ${socket.id} joined swap room ${swapId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});