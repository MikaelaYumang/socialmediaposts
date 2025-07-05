import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/", async (request, response) => {
  const { email, otp, otpExpiry } = request.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !user.otp || !user.otpExpiry) {
      return response.status(404).json({ error: "OTP not found" });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);

    if (!isMatch) {
      return response.status(400).json({ error: "Invalid OTP" });
    }

    const now = new Date();
    if (now > user.otpExpiry) {
      return response.status(400).json({ error: "OTP has expired" });
    }

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        otp: null,
        otpExpiry: null,
        isOTPVerified: true,
      },
    });

    const token = jwt.sign({email}, process.env.SECRET_KEY, {expiresIn: "1h"})

    response.cookie("authToken", token, {
      httpOnly: true,
      sameSite:"lax",
      maxAge: 60*60*1000,
      path: "/"
    })
    response.status(200).json({ msg: "OTP verified successfully" ,token});
  } catch (error) {
    response.status(500).json({ msg: "Verify OTP Error", error });
  }
});

export default router;
