import jwt from "jsonwebtoken";

const secret = process.env.JWT_TOKEN_SECRET;

export const createTokenForUser = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
    username: user.username,
    fullname: user.fullname,
    avatar: user.avatar,
    role: user.role,
  };
  const token = jwt.sign(payload, secret);

  return token;
};

export const validateToken = (token) => {
  const payload = jwt.verify(token, secret);

  return payload;
};
