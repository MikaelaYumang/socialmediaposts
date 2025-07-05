import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    path: "/"      
  });
  res.json({ msg: "Logged out successfully" });
});

export default router;