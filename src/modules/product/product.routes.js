import express from "express";
import * as product from "./controller/product.js";
import { allowedTo, auth } from './../../middleware/auth.js';
import { multerCloudFunction } from "../../utils/multer.js";
import { allowedExtensions } from './../../utils/allowedExtensions.js';

const productRouter = express.Router();

productRouter.route("/")
    .post(auth, allowedTo('admin'), multerCloudFunction(allowedExtensions.Image).array('images', 5), product.addProduct)
    .get(product.getAllProducts)

productRouter.route("/:id")
    .put(auth, allowedTo('admin'), product.updateProduct)
    .delete(auth, allowedTo('admin'), product.deleteProduct)
    .get(auth, allowedTo('admin'), product.getSpecificProduct)



export default productRouter;
