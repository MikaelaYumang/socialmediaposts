import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", (request, response) => {
  const token = request.cookies.token;
  const SECRET_KEY = process.env.SECRET_KEY;

  if (!token) {
    return response.status(401).json({ msg: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    response.json({ authenticated: true, msg: "Authenticated", user: decoded });
  } catch (error) {
    response.status(401).json({ msg: "Invalid token" });
  }
});

export default router;
