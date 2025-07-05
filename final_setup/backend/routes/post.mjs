import express, { request } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/AuthMiddleware.mjs";
const prisma = new PrismaClient();
const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const { id, username } = req.authenticatedUser;
  const { title, description } = req.body;

  try {
    if (!id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        description,
        userId: id,
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

    res.status(200).json({ msg: "Post successfully sent" }, newPost);
  } catch (error) {
    res.status(500).json({ msg: "Not posted" }, error.message);
  }
});

router.get("/", authMiddleware, async (request, response) => {
  const userId = request.authenticatedUser.id;

  if (!userId) {
    return response.status(401).json({ msg: "User not authenticated" });
  }

  const fetchPosts = await prisma.post.findMany({
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  response.status(200).json({ userId, posts: fetchPosts });
});

router.get("/:id", authMiddleware, async (request, response) => {
  const { id } = request.params;
  try {
    const uniquePost = await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    response.status(200).json(uniquePost);
  } catch (error) {
    response
      .status(404)
      .json({ msg: "Error fetching detailed post view", error: error.message });
  }
});

router.delete("/:id", authMiddleware, async (request, response) => {
  const postId = request.params.id;
  const userId = request.authenticatedUser.id;
  try {
    if (!userId) {
      return response.status(401).json({ msg: "Unauthorized deletion" });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return response.status(404).json({ msg: "Post not Found" });
    }

    if (post.userId !== userId) {
      return response.status(403).json({ msg: "You do not own this post" });
    }

    await prisma.post.delete({
      where: { id: postId },
    });
    response
      .status(200)
      .json({ msg: `Successfully deleted post of ${userId}` });
  } catch (error) {
    response
      .status(500)
      .json({ msg: "Error deleting post.", error: error.message });
  }
});

router.put("/:id", authMiddleware, async (request, response) => {
  try {
    const postId = request.params.id;
    const userId = request.authenticatedUser.id;
    const { title, description } = request.body;

    if (!userId) {
      return response.status(401).json({ msg: "Unauthorized update" });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return response.status(404).json({ msg: "Post not found" });
    }

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;

    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title,
        description,
      },
    });
    response.status(200).json({ msg: "Successfully updated post" });
  } catch (error) {
    response.json({ msg: "Error editing post", error: error.message });
  }
});

export default router;
