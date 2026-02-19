import "dotenv/config";
import app from "./app.js";
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

// use it when run locally
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running locally on port ${port}`);
  });
}

//  use export default for vercel
export default app;
