import jwt from "jsonwebtoken";

import { User } from "../models/userModels.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const userVerificationMiddleware = async(req, res, next) => {
  try {
      const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  
      if(!token) throw new ApiError(401, "UNAUTHORIZED REQUEST TOKEN MISSING");
  
      const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
      const user = await User.findById(decodeToken._id).select("-password");
  
      if(!user) throw new ApiError(401, "INVALID ACCESS TOKEN: USER NOT FOUND");
  
      req.user = user;
      next();
  } 
  
  catch (error) {
    if(error instanceof jwt.TokenExpiredError) {
        return next(new ApiError(401, "UNAUTHORIZED REQUEST: TOKEN EXPIRED"));
    }

    else if(error instanceof jwt.JsonWebTokenError) {
        return next(new ApiError(401, "UNAUTHORIZED REQUEST: INVALID TOKEN"));
    };

    next(error)
  }
}