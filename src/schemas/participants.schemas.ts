import Joi from 'joi';
import { PostParticipant } from '../protocols';

export const postPayloadSchema = Joi.object<PostParticipant>({
    name: Joi.string().trim().required(),
    balance: Joi.number().integer().positive().required(),
}).required();
