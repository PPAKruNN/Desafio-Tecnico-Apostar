import Joi from 'joi';
import { PostBetType } from '../protocols';

export const PostBetPayload = Joi.object<PostBetType>({
    amountBet: Joi.number().integer().positive().required(),
    awayTeamScore: Joi.number().integer().positive().allow(0).required(),
    homeTeamScore: Joi.number().integer().positive().allow(0).required(),
    participantId: Joi.number().integer().positive().allow(0).required(),
    gameId: Joi.number().integer().positive().allow(0).required(),
}).required();
