import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      sparse: true
    },
    phone: {
      type: String,
      sparse: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["customer", "admin", "assistant", "editor", "supporter"],
      default: "customer"
    },
    wishList: [
      {
        type: Schema.Types.ObjectId,
        ref: "product"
      }
    ],
    OTP: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);



export const userModel = mongoose.model("user", userSchema);
