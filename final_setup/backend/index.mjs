import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client"
import RegisterRoute from "./routes/register.mjs"
import LoginRoute from "./routes/login.mjs"
import checkRoute from "./routes/check.mjs"
import postRoute from "./routes/post.mjs"
import ownPostRoute from "./routes/ownpost.mjs"
import changePassRoute from "./routes/change-password.mjs"
import logoutRoute from "./routes/logout.mjs"
import sendOTPRoute from "./routes/send-otp.mjs"
import verifyOTPRoute from "./routes/verify-otp.mjs"
import resetPassRoute from "./routes/reset-password.mjs"
import homeRoute from "./routes/home.mjs"
import profileRoute from "./routes/profile.mjs"
import likeRoute from "./routes/like.mjs"
import commentRoute from "./routes/comment.mjs"
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true,               
}));


app.use(express.json());
app.use("/register", RegisterRoute);
app.use("/login", LoginRoute);
app.use("/check", checkRoute);
app.use("/post", postRoute);
app.use("/like", likeRoute);
app.use("/comment", commentRoute);
app.use("/own-post", ownPostRoute);
app.use("/profile", profileRoute);
app.use("/change-password", changePassRoute);
app.use("/logout", logoutRoute);
app.use("/send-otp", sendOTPRoute);
app.use("/verify-otp", verifyOTPRoute);
app.use("/reset-password", resetPassRoute);
app.use("/home", homeRoute);

app.get("/", (req, res) => {
  res.send("Working express");
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
