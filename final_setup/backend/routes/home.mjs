import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/AuthMiddleware.mjs";
const prisma = new PrismaClient();
const router = express.Router();

router.get("/", authMiddleware, (request, response) => {
    const { username } = request.authenticatedUser;

    response.json({ msg: `Welcome, ${username}`, username });
});

export default router;