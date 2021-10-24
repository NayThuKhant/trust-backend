module.exports = {
    initialValidateResponse: (errors, res) => {

        return res.status(422).json({
            code: "Failed",
            message: "Validation Failed",
            errors: errors.errors
        });

    },

    modelValidationResponse: (errors, res) => {
        const validationErrors = errors.errors
        const formattedErrors = [];

        for (const [key, error] of Object.entries(validationErrors)) {
            formattedErrors.push({
                value: error.value,
                msg: error.message,
                param: error.path,
                location: "model"
            })
        }
        return res.status(422).json({
            code: "Failed",
            message: "Validation Failed",
            errors: formattedErrors
        });
    },

    internalServerProblemResponse: (error, res) => {
        console.log(error)
        return res.status(500).json({
            code: "Failed",
            message: "something went wrong"
        })
    },

    rawServerErrorResponse: (code, error, statusCode, res) => {
        console.log(error)
        return res.status(statusCode).json({
            code: code,
            message: error ?? "Something went wrong"
        })
    },


    successResponse: (data, res, message = 'Success') => {
        data = JSON.parse(JSON.stringify(data))
        delete data.jwts
        return res.json({
            code: "Success",
            message,
            data: data
        })
    },

    unauthorizedResponse: (res) => {
        return res.status(401).json({
            code: "Failed",
            message: "Unauthorized"
        })
    },

    ensureXHRResponse: (res) => {
        return res.status(400).json({
            code: "Failed",
            message: "X-Requested-With - XMLHttpRequest Header is not found on the request"
        })
    }
}