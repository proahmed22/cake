import { asyncHandler } from "../../../utils/errorHandling.js";
import { userModel } from './../../../../database/models/user.model.js';
import { ApiFeatures } from './../../../utils/ApiFeatures.js';





const getAllUsers = asyncHandler(async (req, res, next) => {
    let apiFeatures = new ApiFeatures(userModel.find(), req.query).paginate().sort().search().fields().filter()

    const data = await apiFeatures.mongooseQuery

    res.status(200).json({ message: " Fetch Successfully", page: apiFeatures.page, data })
})


const getUserProfile = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const User = await userModel.findById(id)
    !User && next(new Error("User Not Found", { cause: 404 }))
    User && res.status(200).json({ message: "User Found Successfully", User })
})
const updateUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const User = await userModel.findByIdAndUpdate(id, req.body, { new: true })
    !User && next(new Error("User Not Found", { cause: 404 }))
    User && res.status(200).json({ message: " Updated Successfully", User })
})




const deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const User = await userModel.findByIdAndDelete(id)
    !User && next(new Error("User Not Found", { cause: 404 }))
    User && res.status(200).json({ message: " Deleted Successfully", User })
})



export {
    getAllUsers,
    updateUser,
    deleteUser,
    getUserProfile
}




/**
 * Note: This file is not used .
 * in case && 
 * if the first true added the second or true 
 * if the first false added the false or the first 
 */