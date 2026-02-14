import "dotenv/config";
import express from "express";
import { jokes } from "./data/jokes.js";

const app = express();

app.get("/api/jokes", (req, res) => {
  res.json(jokes);
});

// IMPORTANT: No module.exports! Use export default.
export default app;

if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running locally on port ${port}`);
  });
}
