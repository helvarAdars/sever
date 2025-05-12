import express from "express";
import { loginUser, userRegistration } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/userregister", userRegistration);
router.post("/login", loginUser)

export default router;
