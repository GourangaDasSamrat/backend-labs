import "dotenv/config";
import { io, port, server } from "./app.js";

// socket connection
io.on("connection", (socket) => {
  socket.on("userChat", (message) => {
    socket.broadcast.emit("newChat", message); // excludes sender to prevent double message
  });
});

// run server
server.listen(port, () =>
  console.log(`Server running locally on port ${port}`),
);
