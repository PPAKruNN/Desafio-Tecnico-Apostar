import Joi from 'joi';
import { PostFinishGameType, PostGameType } from '../protocols';

export const PostGamePayload = Joi.object<PostGameType>({
    awayTeamName: Joi.string().trim().required(),
    homeTeamName: Joi.string().trim().required(),
}).required();

export const PostFinishGamePayload = Joi.object<PostFinishGameType>({
    awayTeamScore: Joi.number().integer().positive().allow(0).required(),
    homeTeamScore: Joi.number().integer().positive().allow(0).required(),
}).required();
