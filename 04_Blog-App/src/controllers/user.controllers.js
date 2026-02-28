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
  return res.redirect("/users/signin");
});

export const signinUser = asyncHandler(async (req, res) => {
  // extract data from request body
  let { email, password } = req.body;
  email = email?.trim().toLowerCase();

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    if (token) return res.cookie("token", token).redirect("/");
  } catch (err) {
    return res.render("signin", {
      error: "Invalid credentials",
    });
  }
});
