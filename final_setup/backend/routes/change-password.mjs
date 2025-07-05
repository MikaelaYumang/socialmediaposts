import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { authMiddleware } from "../middleware/AuthMiddleware.mjs";
const router = express.Router();

const prisma = new PrismaClient();

// router.put("/:id", async (request, response) => {
//   try {
//     const { id } = request.params;
//     const {  password } = request.body;
//     let saltRounds = 10;
//     const newHashedPass = await bcrypt.hash(password, saltRounds);

//     const findid = await prisma.user.findUnique({
//       where: { id },
//     });

//     if (!findid) {
//       return response.status(404).json({ msg: "User Id not found" });
//     }
//     const updatedPass = await prisma.user.update({
//       where: { id },
//       data: {
//         password: newHashedPass,
//       },
//     });
//     response.json({ success: true, msg: "Password changed successfully", updatedPass });
//   } catch (error) {
//     response.status(400).json({ msg: "Password not changed", error });
//   }
// });

router.put("/", authMiddleware, async (req, res) => {
  try {
    const {id} = req.authenticatedUser;  
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ msg: "Password is required" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const userExists = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!userExists) {
      return res.status(404).json({ msg: "User not found" });
    }

    await prisma.user.update({
      where: { id: id },
      data: { password: hashedPass },
    });

    res.json({ success: true, msg: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Password not changed", error: error.message });
  }
});

export default router;
