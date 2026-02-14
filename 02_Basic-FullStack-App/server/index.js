import "dotenv/config";
import express from "express";
import { jokes } from "./data/jokes.js";

const app = express();

// API Routes
app.get("/api/jokes", (req, res) => {
  res.json(jokes);
});

// For Vercel to work, we must export the express instance
export default app;

// Logic for local development
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running locally on port ${port}`);
  });
}
