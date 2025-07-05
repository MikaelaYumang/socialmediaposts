import express from "express";
import { PrismaClient } from "@prisma/client";
import { OTPmiddleware } from "../middleware/OTPmiddleware.mjs";
import bcrypt from "bcrypt";
const router  =express.Router();
const prisma = new PrismaClient()

router.post("/", OTPmiddleware, async (request,response) => {
    const { email} = request.authUser
    const {password} = request.body

    const hashedPassword = await bcrypt.hash(password, 10)
    try {
        await prisma.user.update({
            where: {email}, data: {
                password: hashedPassword,
                isOTPVerified: false
            }
        })

        response.clearCookie("authToken");
response.status(200).json({ msg: "Password reset successfully!" });

    } catch (error) {
        return response.status(500).json({ error: "Reset password failed", details: error.message})
    }
})

export default router;
