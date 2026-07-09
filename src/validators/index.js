import {body,param} from "express-validator"


//auth validators
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




// Application validators
export const createApplicationValidator = () => {
    return [
        body("companyName")
            .trim()
            .notEmpty()
            .withMessage("Company name is required"),

        body("role")
            .trim()
            .notEmpty()
            .withMessage("Role is required"),

        body("currentStatus")
            .optional()
            .isIn(["Applied", "OA", "Interview Round 1", "Interview Round 2", "HR Round", "Offer", "Rejected"])
            .withMessage("Invalid status value"),

        body("jobUrl")
            .optional()
            .trim(),

        body("location")
            .optional()
            .trim(),

        body("ctc")
            .optional()
            .trim(),

        body("appliedDate")
            .optional()
            .isISO8601()
            .withMessage("Invalid date format"),

        body("notes")
            .optional()
            .trim(),
    ]
}

export const updateApplicationValidator = () => {
    return [
        body("companyName")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Company name cannot be empty"),

        body("role")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Role cannot be empty"),

        body("currentStatus")
            .optional()
            .isIn(["Applied", "OA", "Interview Round 1", "Interview Round 2", "HR Round", "Offer", "Rejected"])
            .withMessage("Invalid status value"),

        body("appliedDate")
            .optional()
            .isISO8601()
            .withMessage("Invalid date format"),

        body("notes")
            .optional()
            .trim(),
    ]
}

// Interview Round validators
export const addInterviewRoundValidator = () => {
    return [
        body("roundName")
            .trim()
            .notEmpty()
            .withMessage("Round name is required"),

        body("roundDate")
            .optional()
            .isISO8601()
            .withMessage("Invalid date format"),

        body("performanceRating")
            .optional()
            .isInt({ min: 1, max: 5 })
            .withMessage("Performance rating must be between 1 and 5")
            .toInt(),
        body("outcome")
            .optional()
            .isIn(["cleared", "rejected", "waiting"])
            .withMessage("Invalid outcome value"),

        body("questionsAsked")
            .optional()
            .trim(),

        body("notes")
            .optional()
            .trim(),
    ]
}

export const updateInterviewRoundValidator = () => {
    return [
        body("roundName")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Round name cannot be empty"),

        body("roundDate")
            .optional()
            .isISO8601()
            .withMessage("Invalid date format"),

        body("performanceRating")
            .optional()
            .isInt({ min: 1, max: 5 })
            .withMessage("Performance rating must be between 1 and 5")
            .toInt(),

        body("outcome")
            .optional()
            .isIn(["cleared", "rejected", "waiting"])
            .withMessage("Invalid outcome value"),

        body("questionsAsked")
            .optional()
            .trim(),

        body("notes")
            .optional()
            .trim(),
    ]
}