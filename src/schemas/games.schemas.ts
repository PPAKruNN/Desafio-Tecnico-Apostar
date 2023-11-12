import Joi from 'joi';
import { PostFinishGame, PostGame } from 'protocols';

export const postGamePayload = Joi.object<PostGame>({
    awayTeamName: Joi.string().trim().required(),
    homeTeamName: Joi.string().trim().required(),
}).required();

export const postFinishGamePayload = Joi.object<PostFinishGame>({
    awayTeamScore: Joi.number().integer().positive().allow(0).required(),
    homeTeamScore: Joi.number().integer().positive().allow(0).required(),
}).required();
