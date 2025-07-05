import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/AuthMiddleware.mjs";
const router = express.Router();
const prisma = new PrismaClient();

router.post("/:id", authMiddleware, async (request, response) => {
    const postId = request.params.id;
    const userId = request.authenticatedUser.id;
    const { content, createdAt }=  request.body;
    try {
        const postcomment = await prisma.comment.create({
            data: {
                postId,
                userId,
                content,
                createdAt
            }
        })
        response.status(200).json({msg: "Comment posted successfully!", postcomment})
    } catch (error) {
        return response.status(500).json({msg:"Error posting comment", error: error.message})
    }
})

router.get("/:id", authMiddleware, async (request, response) => {
    try {
        const postId = request.params.id;

        const fetchComment = await prisma.comment.findMany({
            where: {postId},
            include: {user: {
                select: {
                    username: true, email: true
                }
            }}
        })

        response.status(200).json({comments: fetchComment})
    } catch (error) {
        response.status(500).json({
            msg: "Error fetching comments",
            error: error.message
        })
    }
})

export default router;