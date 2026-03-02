import "dotenv/config";
import server, { port } from "./app.js";

// run server
server.listen(port, () =>
  console.log(`Server running locally on port ${port}`),
);
