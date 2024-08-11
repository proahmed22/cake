import { Schema, model } from "mongoose";

const flavourSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [2, 'too short flavour name']
    },
    slug: {
        type: String,
        lowercase: true
    }
}, { timestamps: true });

export const flavourModel = model('flavour', flavourSchema);