import express from "express";
import * as wishList from "./controller/wishList.js";
import { allowedTo, auth } from '../../middleware/auth.js';

const wishListRouter = express.Router();

wishListRouter.route("/") // /api/v1/categories
    .post(auth, allowedTo('user'), wishList.addToWishList)
    .patch(auth, allowedTo('user'), wishList.removeFromWishList)
    .get(auth, allowedTo('user'), wishList.getAllUserWishlist);


export default wishListRouter;
