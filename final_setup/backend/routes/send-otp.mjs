import express from "express";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt"

const prisma = new PrismaClient();
const router = express.Router();
async function sendOTPEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.GMAIL,
    to: email,
    subject: "Your OTP CODE",
    text: `Your OTP Code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
}

router.post("/", async (request, response) => {
  try {
    const { email } = request.body;
    const findEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (!findEmail) {
      return response.status(404).json({ msg: "Email not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    let saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);

    await prisma.user.update({
      where: { email },
      data: {
        otp: hashedOTP,
        otpExpiry,
        isOTPVerified: false,
      },
    });

    await sendOTPEmail(email, otp);

    response.status(200).json({ msg: "OTP sent to email" });
  } catch (error) {
    response
      .status(500)
      .json({ msg: "Failed to send OTP", error: error.message });
  }
});

export default router;
