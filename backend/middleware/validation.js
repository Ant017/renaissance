const { body } = require("express-validator")

const authValidator = {
    signup: [
        body("username")
            .isString()
            .withMessage("Name must be a string.")
            .custom((value) => {
                if (value === "") {
                    throw new Error("Name cannot be empty")
                }
                return true
            }),
        body("email")
            .isString()
            .withMessage("email must be a string.")
            .bail()
            .isEmail()
            .withMessage("Please enter a valid email id"),

        body("password")
            .custom((value, { req }) => {
                if (value.length < 8) {
                    throw new Error("Password must be longer than 8 characters.")
                }
                const name = req.body.username.toLowerCase()
                if (value.toLowerCase().includes(name)) {
                    throw new Error("Password cannot contain parts of your name.")
                }
                const checkCapitalLetter = /[A-Z]+/
                const checkNumber = /[0-9]+/
                const checkSpecialChar = /[*@!#%&()^~{}]+/

                if (!checkCapitalLetter.test(value) || !checkNumber.test(value) || !checkSpecialChar.test(value)) {
                    throw new Error("Passowrd must contain at least one special character, one Capital letter and one number.")
                }
                return true
            }),
    ]
}

module.exports = authValidator
