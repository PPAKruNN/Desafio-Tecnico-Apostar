import { Router } from 'express';
import { GamesController } from '../controllers/games.controller';
import { validateBody, validateParams } from '../middlewares/validation.middleware';
import { ParamsId } from '../schemas/utils.schema';
import { postFinishGamePayload, postGamePayload } from '../schemas/games.schemas';

export const GamesRouter = Router();

GamesRouter.get('/', GamesController.getGames)
    .get('/:id', validateParams(ParamsId), GamesController.getGameById)
    .post('/', validateBody(postGamePayload), GamesController.postGame)
    .post('/:id/finish', validateParams(ParamsId), validateBody(postFinishGamePayload), GamesController.postFinishGame);
