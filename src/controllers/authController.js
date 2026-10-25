import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken, cookieOptions } from "../utils/generateToken.js";

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await prisma.user.findUnique({
      where: { email },
    });

    if (userExist) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = generateToken(user.id, res);

    res.status(201).json({
      status: "success",
      data: {
        user: { id: user.id, name: user.name, email: user.email },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user.id, res);

    res.status(200).json({
      status: "success",
      data: {
        user: { id: user.id, name: user.name, email: user.email },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.clearCookie("jwt", cookieOptions);
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

export { register, login, logout };