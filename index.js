import express from "express";
import mongoose, { createConnection } from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import BlogRoutes from "./routes/blog.routes.js";
import AuthRoutes from "./routes/auth.routes.js";
import UserRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("DB connected");
  } catch (error) {
    console.log(error);
  }
};
const corsOpts = {
  origin: ['*', "http://localhost:5173"],
  credentials: true,
  methods: ['GET','POST','HEAD','PUT','PATCH','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type']
};
app.use(cors(corsOpts));

// Middlewares
app.use(cookieParser())
app.use(express.json());
app.use("/api/v1/blog", BlogRoutes);
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/user", UserRoutes);

connectDB().then(() => {
  app.listen(port);
  console.log(`Listening on port ${port} `);
});
