import Joi from 'joi';
import { PostFinishGame, PostGame } from 'protocols';

export const postGamePayload = Joi.object<PostGame>({
    awayTeamName: Joi.string().trim(),
    homeTeamName: Joi.string().trim(),
}).required();

export const postFinishGamePayload = Joi.object<PostFinishGame>({
    awayTeamScore: Joi.number().integer().positive().allow(0),
    homeTeamScore: Joi.number().integer().positive().allow(0),
}).required();
