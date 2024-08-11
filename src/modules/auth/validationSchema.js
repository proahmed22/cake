import Joi from "joi";

export const signUp = Joi.object({
    email: Joi.string().email(
        { minDomainSegments: 2, maxDomainSegments: 4, tlds: { allow: ['com', 'net', 'edu', 'eg'  ] } }
    ).required(),
    nationalId: Joi.string().pattern(new RegExp(/[0-9]{14}$/)).required(),
    government: Joi.string().alphanum().required(),
    city: Joi.string().alphanum().required(),
    password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    rePassword: Joi.ref('password'),
    phone: Joi.string().pattern(new RegExp(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/))
}).required();

export const login = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, maxDomainSegments: 4, tlds: { allow: ['com', 'net', 'edu', 'eg'] } }).required(),
    password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
})
