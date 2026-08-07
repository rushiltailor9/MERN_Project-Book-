const Joi = require("joi");

const contactValidtion = (req, res, next) =>{
    const schema = Joi.object({
            name: Joi.string().min(1).max(100).required(),
            email: Joi.string().email().required(),
            phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
            subject: Joi.string().min(1).max(200).required,
            message: Joi.string().min(1).max(1000).required()
        });
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400)
                .json({ message: "Bad Request", error: error.details[0].message });
        }
    next();
}

module.exports = {
    contactValidtion
}
