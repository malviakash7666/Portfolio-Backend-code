import {User} from "../Models/userSchema.js"
import {catchAsyncErrors}  from "../middleware/CatchAsyncErrors.js"
import   ErrorHandler from  "../middleware/errors.js"
import jwt from "jsonwebtoken"

export const isAuthenticated = catchAsyncErrors(async (req,res,next) => {
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("User Is Not Authorized!",400))
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user =await User.findById(decoded.id);
    next()
})