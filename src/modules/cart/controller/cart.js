import { asyncHandler } from "../../../utils/errorHandling.js";
import { addOne, deleteOne, getAll, updateOne } from "../../../handlers/factor.js";
// import { ApiFeatures } from "../../../utils/apiFeatures.js";
import { cartModel } from './../../../../database/models/cart.model.js';
import { productModel } from './../../../../database/models/product.model.js';
import { couponModel } from './../../../../database/models/coupon.model.js';

function calcTotalPrice(cart) {
    let totalPrice = 0;
    cart.cartItems.forEach(elem => {
        totalPrice += elem.quantity * elem.price
    });
    cart.totalPrice = totalPrice
}


const addProductToCart = asyncHandler(async (req, res, next) => {
    let product = await productModel.findById(req.body.product).select('price')
    if (!product) return next(new Error("Product Not Found", { cause: 404 }))
    req.body.price = product.price
    let isCartExist = await cartModel.findOne({ user: req.user._id })
    if (!isCartExist) {
        let cart = new cartModel({
            user: req.user._id,
            cartItems: [req.body]
        })
        calcTotalPrice(cart)
        await cart.save()
        return res.json({ message: "Product Added Successfully", cart })
    }


    let item = isCartExist.cartItems.find(item => item.product == req.body.product)
    if (item) {
        item.quantity += req.body.quantity || 1
    } else {
        isCartExist.cartItems.push(req.body)
    }
    calcTotalPrice(isCartExist)
    if (isCartExist.discount) {
        isCartExist.totalPriceAfterDiscount = isCartExist.totalPrice - (isCartExist.totalPrice * isCartExist.discount) / 100
    }

    await isCartExist.save()
    res.json({ message: "Add To Cart ", cart: isCartExist })
})


const removeProductFromCart = asyncHandler(async (req, res, next) => {
    let result = await cartModel.findOneAndUpdate({ user: req.user._id }, { $pull: { cartItems: { _id: req.params.id } } }, { new: true })
    !result && next(new Error("Cart Items Not Found", { cause: 404 }))
    calcTotalPrice(result)

    result && res.status(200).json({ message: " removed Successfully", cart: result })
})


const updateQuantity = asyncHandler(async (req, res, next) => {
    let product = await productModel.findById(req.params.id).select('price')
    if (!product) return next(new Error("Product Not Found", { cause: 404 }))

    let isCartExist = await cartModel.findOne({ user: req.user._id })

    let item = isCartExist.cartItems.find(item => item.product == req.params.id)

    if (item) {
        item.quantity = req.body.quantity
    }
    calcTotalPrice(isCartExist)

    await isCartExist.save()
    return res.json({ message: "Quantity Updated Successfully", cart })

})

const applyCoupon = asyncHandler(async (req, res, next) => {
    let coupon = await couponModel.findOne({ code: req.body.code, expires: { $gt: Date.now() } })
    let cart = await cartModel.findOne({ user: req.user._id })
    cart.totalPriceAfterDiscount = cart.totalPrice - (cart.totalPrice * coupon.discount) / 100
    cart.discount = coupon.discount
    await cart.save()
    return res.json({ message: "Coupon Applied Successfully", cart })
})


const getLoggedUserCart = asyncHandler(async (req, res, next) => {
    let cartItems = await cartModel.findOne({ user: req.user._id }).populate('cartItems.product')
    return res.json({ message: "Cart Items", Cart: cartItems })
})





export {
    addProductToCart,
    removeProductFromCart,
    updateQuantity,
    applyCoupon,
    getLoggedUserCart

}




