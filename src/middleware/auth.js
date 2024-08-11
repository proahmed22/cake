import Jwt from 'jsonwebtoken';
import { StatusCodes } from "http-status-codes";
import { asyncHandler } from './../utils/errorHandling.js';
import { userModel } from './../../database/models/user.model.js';



export const auth = async (req, res, next) => {
    const { token } = req.headers;
    try {
        if (!token) {
            return next(
                new Error('Token Not Provided', StatusCodes.UNAUTHORIZED)
            );
        }

        let decodedToken = await Jwt.verify(token, process.env.JWT_SECRET)

        let user = await userModel.findById(decodedToken.id);

        if (!user) {
            return next(
                new Error('Not registered account', StatusCodes.NOT_FOUND)
            );
        } else {
            new Error('Not registered account', StatusCodes.NOT_FOUND)
        }
        req.user = user;
        return next();
    } catch (err) {
        return next(
            new Error('Invalid token payload', StatusCodes.UNAUTHORIZED)
        );
    }
}


export const allowedTo = (...roles) => {
    return asyncHandler(async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            console.log(req.user.role);
            return next(new Error("Not authorized" + req.user.role, { cause: StatusCodes.FORBIDDEN }));
        }
        next()
    })
}



