import { asyncHandler } from './../../../utils/errorHandling.js';
import { productModel } from './../../../../database/models/product.model.js';
import slugify from 'slugify';
import { ApiFeatures } from '../../../utils/ApiFeatures.js';
import cloudinary from './../../../utils/cloudinary.js';

const addProduct = asyncHandler(async (req, res, next) => {
    const imageUrls = [];
    if (req.files) {
        for (const file of req.files) {
            const data = await cloudinary.uploader.upload(file.path, { folder: "cake" });
            imageUrls.push(data.secure_url);
        }
    }
    const productData = {
        ...req.body,
        images: imageUrls
    };

    const product = new productModel(productData);
    await product.save();

    res.status(201).json({ message: " Added Successfully", data: product })

})

/////
const getAllProducts = asyncHandler(async (req, res, next) => {
    let apiFeatures = new ApiFeatures(productModel.find(), req.query).paginate().sort().search().fields().filter()

    let products = await apiFeatures.mongooseQuery

    res.status(200).json({ message: " Fetch Successfully", page: apiFeatures.page, data: products })
})


const getSpecificProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const data = await productModel.findById(id)
    !data && next(new Error(`Product Not Found`, { cause: 404 }))
    data && res.status(200).json({ message: "Product Found Successfully", data })
})

const updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    if (req.body.title) req.body.slug = slugify(req.body.title)
    const data = await productModel.findByIdAndUpdate(id, req.body, { new: true })
    !data && next(new Error(`Product Not Found`, { cause: 404 }))
    data && res.status(200).json({ message: "Product Updated Successfully", data })
})

const deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const data = await productModel.findByIdAndDelete(id)
    !data && next(new Error(`Product Not Found`, { cause: 404 }))
    data && res.status(200).json({ message: "Product Deleted Successfully", data })
})

export {
    addProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getSpecificProduct
}