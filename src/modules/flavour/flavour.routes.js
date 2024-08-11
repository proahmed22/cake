import express from "express";
import * as flavour from "./controller/flavour.js";
import { allowedTo, auth } from '../../middleware/auth.js';

const flavourRouter = express.Router();



flavourRouter.route("/")
    .post(auth, allowedTo('admin'), flavour.addFlavour)
    .get(flavour.getAllCategories);

flavourRouter.route("/:id")
    .put(auth, allowedTo('admin'), flavour.updateFlavour)
    .delete(auth, allowedTo('admin'), flavour.deleteFlavour);

export default flavourRouter;
