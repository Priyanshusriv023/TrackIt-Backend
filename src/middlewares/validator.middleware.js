import {validationResult} from "express-validator"
import {apiError} from "../utils/api-Error.js"

export const validate = (req, res, next) => {
    const errors = validationResult(req);//this will give us all the error that we have in our request body,params,query etc. and we can use it to send response to user about what is wrong with the data they sent

    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = [];

    errors.array().map((err) =>
        extractedErrors.push({
            [err.path]: err.msg
        })
    
    );

    throw new apiError(422,"Received data is not valid",extractedErrors)
};


