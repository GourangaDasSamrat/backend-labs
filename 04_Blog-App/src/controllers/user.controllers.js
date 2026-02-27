import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// sign up controller
export const signupUser = asyncHandler(async (req, res) => {
  // extract data from request body
  let { email, username, fullname, password } = req.body;
  username = username?.trim().toLowerCase();
  email = email?.trim().toLowerCase();
  fullname = fullname?.trim();

  // create document on db
  await User.create({
    fullname,
    username,
    email,
    password,
  });

  // redirect to homepage
  return res.redirect("/signin");
});

export const signinUser = asyncHandler(async (req, res) => {
  // extract data from request body
  let { email, password } = req.body;
  email = email?.trim().toLowerCase();

  const user = await User.matchPassword(email, password);

  if (user) res.redirect('/')
});
