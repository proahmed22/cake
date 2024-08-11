import Joi from "joi";

const createReviewValidation = Joi.object({
    review: Joi.string().required(),
    product: Joi.string().required(),
    user: Joi.string(),
    rate: Joi.number(),
})

const updateReviewValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
    review: Joi.string().required(),

})
const deleteReviewValidation = Joi.object({
    id: Joi.string().hex().length(24).required()
})

export {
    createReviewValidation,
    updateReviewValidation,
    deleteReviewValidation
}