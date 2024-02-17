import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const PORT = process.env.PORT || 3001;

const characters = [];

const generateRandomPosition = () => {
  return [Math.random() * 6, 0, Math.random() * 6];
};
function generateRandomRGB() {
  const min = 0; // Minimum RGB value
  const max = 5; // Maximum RGB value
  const r = Math.floor(Math.random() * (max - min + 1)) + min;
  return r;
}

app.get("/", (req, res) => {
  res.write(`<h1>Socket IO Start on Port : ${PORT}</h1>`);
  res.end();
});

//whenever a new user connects to server, this event will be triggered
io.on("connection", (socket) => {
  console.log("user connected");

  characters.push({
    id: socket.id,
    position: generateRandomPosition(),
    r: generateRandomRGB(),
    g: generateRandomRGB(),
    b: generateRandomRGB(),
  });
  
  socket.emit("hello");
  io.emit("characters", characters);
  socket.on("disconnect", () => {
    console.log("user disconnected", characters);
    characters.splice(
      characters.findIndex((character) => character.id === socket.id),
      1
    );
    io.emit("characters", characters);
  });
});

server.listen(PORT, () => {
  console.log("listening on *:3000");
});
