import express, { request } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/AuthMiddleware.mjs";
const prisma = new PrismaClient();
const router = express.Router();

// router.post("/", authMiddleware, async (request, response) => {
//   const userId = request.authenticatedUser.id;
//   const { bio, location } = request.body;

//   const existingProfile = await prisma.profile.findUnique({
//     where: { userId },
//   });

//   if (existingProfile) {
//     return response.status(400).json({ msg: "User profile already created" });
//   }

//   const profile = await prisma.profile.create({
//     data: {
//       bio,
//       location,
//       userId,
//     },
//     include: {
//         user: {
//             select: {
//                 username: true,
//                 email: true
//             }
//         }
//     }
//   });
//   response.status(200).json({ msg: "Successfully created profile", profile });
// });

router.delete("/", authMiddleware, async (request, response) => {
  const userId = request.authenticatedUser.id;

  const existingProfile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!existingProfile) {
    return response.status(404).json({ msg: "Profile not found" });
  }

  await prisma.profile.delete({
    where: { userId },
  });

  response.status(200).json({ msg: "Successfully deleted post" });
});

router.get("/", authMiddleware, async (request, response) => {
  const userId = request.authenticatedUser.id;

  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
        user: {
            select: {
                username: true,
                email: true
            }
        }
    }
  });

  if (!profile) {
    return response.status(404).json({ msg: "Profile not found" });
  }

  response.status(200).json(profile);
});

router.put("/", authMiddleware, async (request, response) => {
  try {
    const userId = request.authenticatedUser.id;
    const { bio, location }= request.body;

    const updatedProfile = await prisma.profile.upsert({
      where: { userId},
      update: {
        bio, location
      },
      create: {
        userId,
      },
      include: {
        user: {
          select: {
            username: true,
            email: true
          }
        }
      }
    })

    response.status(200).json({msg: "User updated successfully", updatedProfile})
  } catch (error) {
    response.status(400).json({msg: "Error", error: error.message})
  }
    
});

export default router;
