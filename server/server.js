const http = require('http'); // Import HTTP
const app = require('./app');
const socketIo = require("socket.io");
const cors = require("cors");

// Create the HTTP server using the Express app
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000,  // 60 seconds timeout
  pingInterval: 25000, // 25 seconds interval
});

app.use(cors({
  origin: "http://localhost:3000"
}));

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.set('socketio', io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

