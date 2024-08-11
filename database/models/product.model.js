import e from "express";
import { Schema, model } from "mongoose";

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [10, 'too short product title']
    },
    price: {
        type: String,
        required: true,
        default: 0,
        min: 0
    },
    priceAfterDiscount: {
        type: Number,
        default: 0,
        min: 0
    },
    description: {
        type: String,
        minlength: [10, 'too short product title'],
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        default: 0,
        min: 0,
        required: [true, 'quantity is required']
    },
    images: {
        type: [String]
    },
    flavour: {
        type: String,
        enum: ['CHOCOLATE MUD', 'ORANGE MUD', 'CARAMEL MUD', 'MARBLE', "RAINBOW SWIRL", "RED VELVET", "RASPBERRY ", "ANGEL CAKE"],
    },
    type: {
        type: String,
        enum: ["Creamy", "Sugar"],
    },
    cakeWeight: {
        type: String,
        enum: ["2kg", "2.5kg", "3kg", "3.5kg", "5kg", "6kg", "7kg", "8kg", "9kg", "10kg", "11kg", "12kg"]
    },
    deliveryTime: {
        type: String,
    },
    deliveryPrice: {
        type: String
    },
    occasion: {
        type: String,
    },
    subOccasion: {
        type: String
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

export const productModel = model('product', productSchema);