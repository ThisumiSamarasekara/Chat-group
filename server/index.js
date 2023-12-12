//Import the express library to create a web server.
const express = require("express");

//Create an Express application instance.
const app = express();

//Import the http module to create an HTTP server.
const http = require("http");

//Import the cors module to handle Cross-Origin Resource Sharing (CORS).
const cors = require("cors");

//Import the Server class from socket.io to create a WebSocket server.
const { Server } = require("socket.io");

//Use the cors middleware to enable CORS for the Express app.
app.use(cors());

//Create an HTTP server using the Express app.
const server = http.createServer(app);

//Create a Socket.IO server by passing the HTTP server and configuration options.
//CORS is configured to allow requests from http://localhost:3000 with methods GET and POST
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//Listen for the connection event on the Socket.io server.
//When a client connects, the provided callback function is executed.
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  //Listen for the custom event join_room on the socket.
  //When this event is received, the socket joins a room specified by the data
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} Joined room: ${data}`);
  });

  //Listen for the custom event send_message on the socket.
  //When this event is received, broadcast the message to all clients in the specified room
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  //Listen for the disconnect event on the socket.
  //When a client disconnects, log a message
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

//Start the server on port 3001 and log a message when the server is running
server.listen(3001, () => {
  console.log("Server running");
});
