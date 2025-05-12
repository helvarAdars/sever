import express from "express";
import { authorize, restrict } from "../auth/verfiyToken.js";
import { deleteUser, getAllUsers, singleUserProfile, updateUser } from "../controller/user.controller.js";

const router = express.Router();

router.put("/updateprofile/:id", authorize, restrict(["user"]), updateUser);
router.delete("/deleteuser/:id", authorize, restrict(["admin"]), deleteUser);
router.get("/getallusers", authorize, restrict(["admin"]), getAllUsers);
router.get("/getsingleuserprofile/:id", authorize, restrict(["user", "admin"]), singleUserProfile);

export default router;
