import { Schema, model } from "mongoose";

const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user", },
    cartItems: [
        {
            product: { type: Schema.Types.ObjectId, ref: "product" },
            quantity: { type: Number, },
            price: Number,
        }
    ],
    totalOrderPrice: Number,
    shippingAddress: {
        address: String,
        city: String,
        postalCode: String,
        phone: String
    },
    isDelivered: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

export const orderModel = model("order", orderSchema);
