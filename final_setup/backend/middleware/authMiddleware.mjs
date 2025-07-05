import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  console.log("Token from cookies:", token);
  const SECRET_KEY = process.env.SECRET_KEY;

  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Decoded JWT:", decoded);
    req.authenticatedUser = decoded;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(401).json({ msg: "Invalid token" });
  }
}

