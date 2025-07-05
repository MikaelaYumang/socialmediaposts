import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/AuthMiddleware.mjs";
const router = express.Router();
const prisma = new PrismaClient();

router.get("/", authMiddleware, async (request, response) => {
    const userId = request.authenticatedUser.id;

    const post = await prisma.post.findMany({where: {userId}})
    response.status(200).json(post)
});

export default router;