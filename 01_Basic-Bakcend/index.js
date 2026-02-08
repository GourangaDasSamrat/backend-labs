import express from "express";
import 'dotenv/config'

const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/login", (req, res) => {
  res.send("<h1>Login here</h1>");
});

app.get("/signup", (req, res) => {
  res.send("Sign up");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
