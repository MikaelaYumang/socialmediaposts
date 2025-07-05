import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();

router.post("/", async (request, response) => {
  try {
    const { username, email, password } = request.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingEmail) {
      return response.status(400).json({ msg: `Email ${email} already taken` });
    }

    if (existingUsername) {
      return response
        .status(400)
        .json({ msg: `Username ${username} already taken` });
    }

    const createUser = await prisma.user.create({
  data: {
    username,
    email,
    password: hashedPassword,
  },
});
response.status(201).json({
  msg: `User ${username} created successfully`,
  createUser
});


  } catch (error) {
    response.status(400).json({ msg: "User not created", error });
  }
});

router.get("/", async (request, response) => {
  try {
    const getAllUsers = await prisma.user.findMany(); // no filters = get all users
    response.json({ msg: "All users", users: getAllUsers });
  } catch (error) {
    response.status(500).json({ msg: "Failed to get users", error });
  }
});


router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const deleteUser = await prisma.user.delete({
      where: { id },
    });

    response.json({ msg: "User deleted successfully", deleteUser });
  } catch (error) {
    response.status(400).json({ msg: "User not deleted", error });
  }
});

export default router;
