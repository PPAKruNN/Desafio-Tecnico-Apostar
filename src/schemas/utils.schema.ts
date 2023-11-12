import Joi from 'joi';

export const ParamsId = Joi.object({
    id: Joi.number().positive().integer().allow(0).required(),
}).required();
