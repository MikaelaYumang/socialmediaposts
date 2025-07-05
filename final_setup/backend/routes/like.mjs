import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/AuthMiddleware.mjs";
const router = express.Router();
const prisma = new PrismaClient();

router.post("/:id", authMiddleware, async (request, response) => {
  try {
    const postId = request.params.id;
    const userId = request.authenticatedUser.id;

    const existingLike = await prisma.like.findUnique({
      where: {userId}
    })
    if (existingLike) {
      return response.status(500).json({msg: "User already liked the post"})
    }

    const like = await prisma.like.create({
      data: {
        postId,
        userId
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });
    response.status(200).json({ msg: "Like posted", like });
  } catch (error) {
    response
      .status(400)
      .json({ msg: "Error posting likes", error: error.message });
  }
});

router.delete("/:id", authMiddleware, async (request, response) => {
  try {
    const postId = request.params.id;
    const userId = request.authenticatedUser.id;

    const deleted = await prisma.like.delete({
      where: {
        userId,
        postId,
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });
    response.status(200).json({ msg: "Like deleted", deleted });
  } catch (error) {
    response
      .status(400)
      .json({ msg: "Error posting likes", error: error.message });
  }
});

router.get("/:id/users", authMiddleware, async (request, response) => {
  try {
    const postId = request.params.id;
    const { id } = request.authenticatedUser;

    const likes = await prisma.like.findMany({
      where: { postId },
      include: {
        user: true,
      },
    });

    const users = likes.map((like) => ({
      id: like.user.id,
      username: like.user.username,
      email: like.user.email,
    }));

    response.status(200).json(users);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

export default router;