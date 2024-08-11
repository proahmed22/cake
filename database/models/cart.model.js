import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user", },
    cartItems: [
        {
            product: { type: Schema.Types.ObjectId, ref: "product" },
            quantity: {
                type: Number,
                default: 1
            },
            price: Number,
            totalProductDiscount: Number
        }
    ],
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    discount: Number

}, { timestamps: true });

export const cartModel = model("cart", cartSchema);
