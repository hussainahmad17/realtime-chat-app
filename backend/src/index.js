import dotenv from "dotenv";
dotenv.config();


import express from "express";
console.log('✅ MONGODB_URI:', process.env.MONGODB_URI);
console.log('✅ Cloudinary Name:', process.env.CLOUDINARY_CLOUD_NAME);
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";


const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src * 'self' blob: data:;");
  next();
});


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

}

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
