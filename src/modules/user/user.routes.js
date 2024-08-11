import express from "express";
const userRouter = express.Router();
import * as user from "./controller/user.js";
import { auth } from './../../middleware/auth.js';

userRouter.route("/")
    .get(auth, user.getAllUsers)

userRouter.route("/:id")
    .put(auth, user.updateUser)
    .delete(auth, user.deleteUser)
    .get(auth, user.getUserProfile)
export default userRouter;
