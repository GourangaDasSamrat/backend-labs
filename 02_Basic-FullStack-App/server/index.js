import "dotenv/config";
import express from "express";
import { jokes } from "./data/jokes.js";

const app = express();
const port = process.env.PORT || 3000;

// serve a list of jokes

app.get("/api/jokes", (req, res) => {
  res.json(jokes);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
