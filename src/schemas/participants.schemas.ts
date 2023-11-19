import Joi from 'joi';
import { PostParticipantType } from '../protocols';

export const PostPayloadSchema = Joi.object<PostParticipantType>({
    name: Joi.string().trim().required(),
    balance: Joi.number().integer().positive().required(),
}).required();
