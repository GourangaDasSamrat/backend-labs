import "dotenv/config";
import express from "express";

const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.listen(port || 5000, () => {
  console.log(`Example app listening on port ${port}`);
});
