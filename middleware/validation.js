const joi = require("@hapi/joi");

const signinValidation = (bodyData) => {
    const siginSchema = joi.object({
        name: joi.string().required().min(3),
        email: joi.string().required().min(7).email(),
        password: joi.string().required().min(6)
    });
    return siginSchema.validate(bodyData);
}

const loginValidation = (bodyData) => {
    const loginSchema = joi.object({
        email: joi.string().required().min(7).email(),
        password: joi.string().required()
    });
    return loginSchema.validate(bodyData);
}

const meetingValidation = (bodyData) => {
    const meetingSchema = joi.object({
        agenda: joi.string().required().trim().min(3).uppercase(),
        details: joi.string().required().trim().min(10)
    });
    return meetingSchema.validate(bodyData);
}
module.exports = {
    signinValidation,
    loginValidation,
    meetingValidation
}