import "dotenv/config";
import app, { port } from "./app.js";
import connectDB from "./db/index.js";

// connect database
connectDB()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

// run app
  app.listen(port, () => {
    console.log(`Server running locally on port ${port}`);
  });

