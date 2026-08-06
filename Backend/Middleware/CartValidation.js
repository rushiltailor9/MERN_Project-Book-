const Joi = require("joi");

const cartValidation = (req, res, next) =>{
    const schema = Joi.object({
            bookId: Joi.string().required(),
            bookName: Joi.string().min(1).max(100).required(),
            authorName: Joi.string().min(1).max(100).required(),
            price: Joi.number().positive().required(),
            bookImg: Joi.string().required(),
            language:Joi.string().min(1).max(100).required(),
            quantity:Joi.number().integer().max(1).default(1)
        });
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400)
                .json({ message: "Bad Request", error: error.details[0].message });
        }
    next();
}

module.exports = {
    cartValidation
}

