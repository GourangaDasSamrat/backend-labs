import "dotenv/config";
import express from "express";

const app = express();
const port = process.env.PORT;

const githubData = {
  login: "GourangaDasSamrat",
  id: 146644902,
  node_id: "U_kgDOCL2fpg",
  avatar_url: "https://avatars.githubusercontent.com/u/146644902?v=4",
  gravatar_id: "",
  url: "https://api.github.com/users/GourangaDasSamrat",
  html_url: "https://github.com/GourangaDasSamrat",
  followers_url: "https://api.github.com/users/GourangaDasSamrat/followers",
  following_url:
    "https://api.github.com/users/GourangaDasSamrat/following{/other_user}",
  gists_url: "https://api.github.com/users/GourangaDasSamrat/gists{/gist_id}",
  starred_url:
    "https://api.github.com/users/GourangaDasSamrat/starred{/owner}{/repo}",
  subscriptions_url:
    "https://api.github.com/users/GourangaDasSamrat/subscriptions",
  organizations_url: "https://api.github.com/users/GourangaDasSamrat/orgs",
  repos_url: "https://api.github.com/users/GourangaDasSamrat/repos",
  events_url: "https://api.github.com/users/GourangaDasSamrat/events{/privacy}",
  received_events_url:
    "https://api.github.com/users/GourangaDasSamrat/received_events",
  type: "User",
  user_view_type: "public",
  site_admin: false,
  name: "Gouranga Das Samrat ",
  company: null,
  blog: "https://gouranga.qzz.io/",
  location: "Khulna,Bangladesh",
  email: null,
  hireable: true,
  bio: "Full Stack Developer | MERN Stack Expert | Technical Writer | Building Scalable Web Solutions ",
  twitter_username: "Gouranga_Khulna",
  public_repos: 29,
  public_gists: 0,
  followers: 19,
  following: 14,
  created_at: "2023-10-01T13:29:56Z",
  updated_at: "2026-02-04T04:44:42Z",
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/login", (req, res) => {
  res.send("<h1>Login here</h1>");
});

app.get("/signup", (req, res) => {
  res.send("Sign up");
});

app.get("/github", (req, res) => {
  res.json(githubData);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
