import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

router.post("/", async (request, response) => {
  try {
    const { email, password } = request.body;
    const SECRET_KEY = process.env.SECRET_KEY;

    const user = await prisma.user.findUnique({
        where: { email }
    });

     if (!user) {
      return response.status(404).json({ msg: "User email not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if(!isPasswordCorrect) {
        return response.status(404).json({ msg: "Password not matched" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email }, 
        SECRET_KEY,
      );

      response.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/", 
    });

    response.status(200).json({
      msg: "User successfully logged in",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token
    });
  } catch (error) {
    response.status(400).json({ msg: "Error logging in", error });
  }
});

export default router;
