import { asyncHandler } from "../../../utils/errorHandling.js";
import { addOne, deleteOne, getAll, updateOne } from "../../../handlers/factor.js";
import { cartModel } from '../../../../database/models/cart.model.js';
import { productModel } from '../../../../database/models/product.model.js';
import { couponModel } from '../../../../database/models/coupon.model.js';
import { orderModel } from './../../../../database/models/order.model.js';
import Stripe from 'stripe';
import { ApiFeatures } from "../../../utils/ApiFeatures.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



const createCashOrder = asyncHandler(async (req, res, next) => {
    // 1- get cart (cartId)
    const cart = await cartModel.findById(req.params.id)
    // 2- get total price 
    const totalOrderPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice
    // 3- create order
    const order = new orderModel({
        user: req.user._id,
        cartItems: cart.cartItems,
        totalOrderPrice,
        shippingAddress: req.body.shippingAddress,
    })
    await order.save()
    // 4- increment sold && decrement Quantity
    if (order) {
        let options = cart.cartItems.map(item => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: item.quantity } }
            }

        }))

        await productModel.bulkWrite(options)
        // 5- clear User cart
        await cartModel.deleteOne({ _id: req.params.id })
        return res.json({ message: "Cash Order Created", order })

    } else {
        return next(new Error("Order Not Created", { cause: 404 }))
    }
})


const getSpecificOrder = asyncHandler(async (req, res, next) => {
    let order = await orderModel.findOne({ user: req.user._id }).populate('cartItems.product')
    !order && next(new Error("Order Not Found ", { cause: 404 }))
    order && res.status(200).json({ message: "  Successfully", order })
})

const getAllOrders = asyncHandler(async (req, res, next) => {
    let orders = await orderModel.find({}).populate('cartItems.product')
    !orders && next(new Error("Order Not Found ", { cause: 404 }))
    orders && res.status(200).json({ message: "  Successfully", orders })
})

const createCheckOutSession = asyncHandler(async (req, res, next) => {

    const cart = await cartModel.findById(req.params.id)
    const totalOrderPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice


    let session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    unit_amount: totalOrderPrice * 100,
                    product_data: {
                        name: req.user.name
                    },
                },
                quantity: 1
            }
        ],
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CANCEL_URL}/cancel`,
        customer_email: req.user.email,
        client_reference_id: req.params.id,
        metadata: req.body.shippingAddress
    });
    res.status(200).json({ message: "  Successfully", session })

})

export {
    createCashOrder,
    getSpecificOrder,
    getAllOrders

}




