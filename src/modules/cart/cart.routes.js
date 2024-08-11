import express from "express";
import * as cart from "./controller/cart.js";
import { validation } from '../../middleware/validation.js';
import { allowedTo, auth } from '../../middleware/auth.js';

const cartRouter = express.Router();

cartRouter.route("/")
    .post(auth, allowedTo('user'), cart.addProductToCart)
    .get(auth, allowedTo('user'), cart.getLoggedUserCart)
// .get(cart.);

cartRouter.post('applyCoupon', auth, allowedTo('user'), cart.applyCoupon);

cartRouter.route("/:id") // /api/v1/categories/:id
    .delete(auth, allowedTo('user'), cart.removeProductFromCart)
    .put(auth, allowedTo('user'), cart.updateQuantity);

export default cartRouter;
