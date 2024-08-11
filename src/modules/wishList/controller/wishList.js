import { userModel } from "../../../../database/models/user.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";



const addToWishList = asyncHandler(async (req, res, next) => {
    const { product } = req.body
    let result = await userModel.findByIdAndUpdate(req.user._id, { $addToSet: { wishList: product } }, { new: true })
    !result && next(new Error("User Not Found", { cause: 404 }))
    result && res.status(200).json({ message: " Added Successfully", result: result.wishList })
})

const removeFromWishList = asyncHandler(async (req, res, next) => {
    const { product } = req.body
    let result = await userModel.findByIdAndUpdate(req.user._id, { $pull: { wishList: product } }, { new: true })
    !result && next(new Error("User Not Found", { cause: 404 }))
    result && res.status(200).json({ message: " Added Successfully", result: result.wishList })
})

const getAllUserWishlist = asyncHandler(async (req, res, next) => {
    let result = await userModel.findOne({ _id: req.user._id }).populate('wishList')
    !result && next(new Error("User Not Found", { cause: 404 }))
    result && res.status(200).json({ message: " Added Successfully", result: result.wishList })
})
export {
    addToWishList,
    removeFromWishList,
    getAllUserWishlist

}




