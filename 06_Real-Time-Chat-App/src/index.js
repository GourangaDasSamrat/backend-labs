import "dotenv/config";
import { io, port, server } from "./app.js";

// socket connection
io.on("connection", (socket) => {
  socket.on("userChat", (message) => {
    io.emit("newChat", message);
  });
});

// run server
server.listen(port, () =>
  console.log(`Server running locally on port ${port}`),
);
