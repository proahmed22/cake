import express from "express";
import * as order from "./controller/order.js";
import { validation } from '../../middleware/validation.js';
import { allowedTo, auth } from '../../middleware/auth.js';

const orderRouter = express.Router();

orderRouter.route("/")
    .get(auth, allowedTo('user'), order.getSpecificOrder)

orderRouter.get('/all', order.getAllOrders)

orderRouter.route("/:id") // /api/v1/categories/:id
    .post(auth, allowedTo('user'), order.createCashOrder)

export default orderRouter;
