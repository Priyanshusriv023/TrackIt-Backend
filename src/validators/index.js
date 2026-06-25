import {body} from "express-validator"

export const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid"),

        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required")
            .isLowercase()
            .withMessage("username should be in lowercase")
            .isLength({min:3})
            .withMessage("length should be atleast 3"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("password is required"),
        body("fullname")
            .optional()
            .trim()
        

    ];
};

export const userLoginValidator = () => {
    return [
        body("email")
            .optional()
            .isEmail()
            .withMessage("Email is invalid"),

        body("password")
            .notEmpty()
            .withMessage("Password is required")
    ];
};

export const userChangeCurrentPasswordValidator = () => {
        return [
            body("oldPassword")
            .trim()
            .notEmpty()
            .withMessage("Old password is required"),
            body("newPassword")
            .trim()
            .notEmpty()
            .withMessage("New password is required")
        ]
}

export const userForgotPasswordValidator = ()=> {
          return [
             body("email")
           .trim()
           .notEmpty()
           .withMessage("Email is required")
           .isEmail()
           .withMessage("Email is invalid")
          ]
}

export const userResetForgotPasswordValidator = ()=> {
          return [
             body("newPassword")
             .trim()
             .notEmpty()
             .withMessage("Password is required")
             
          ]
}