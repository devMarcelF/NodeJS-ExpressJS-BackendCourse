import jwt from "jsonwebtoken";

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

export const generateToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  const { exp } = jwt.decode(token);

  res.cookie("jwt", token, {
    ...cookieOptions,
    maxAge: exp * 1000 - Date.now(),
  });

  return token;
};