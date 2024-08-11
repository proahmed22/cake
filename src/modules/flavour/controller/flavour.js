import slugify from "slugify"
import { flavourModel } from './../../../../database/models/flavour.model.js';
import { asyncHandler } from "../../../utils/errorHandling.js";
import { ApiFeatures } from '../../../utils/ApiFeatures.js';



const addFlavour = asyncHandler(async (req, res, next) => {
    req.body.slug = slugify(req.body.name)
    const data = await flavourModel(req.body)
    await data.save()
    res.status(201).json({ message: " Added Successfully", data })
})

const getAllFlavours = asyncHandler(async (req, res, next) => {

    let apiFeatures = new ApiFeatures(flavourModel.find(), req.query).paginate().sort().search().fields().filter()

    const data = await apiFeatures.mongooseQuery

    res.status(200).json({ message: " Fetch Successfully", page: apiFeatures.page, data })
})


const updateFlavour = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const data = await flavourModel.findByIdAndUpdate(id, req.body, { new: true })
    !data && next(new Error("data Not Found", { cause: 404 }))
    data && res.status(200).json({ message: " Updated Successfully", data })
})

const deleteFlavour = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const data = await flavourModel.findByIdAndDelete(id)
    !data && next(new Error("data Not Found", { cause: 404 }))
    data && res.status(200).json({ message: " Deleted Successfully", data })
})



export {
    addFlavour,
    getAllFlavours,
    updateFlavour,
    deleteFlavour

}




/**
 * Note: This file is not used .
 * in case && 
 * if the first true added the second or true 
 * if the first false added the false or the first 
 */