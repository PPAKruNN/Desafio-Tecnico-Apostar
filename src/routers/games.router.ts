import { Router } from 'express';
import { GamesController } from 'controllers/games.controller';
import { validateParams } from 'middlewares/validation.middleware';
import { ParamsId } from 'schemas/utils.schema';

export const GamesRouter = Router();

GamesRouter.get('/', GamesController.getGames).get('/:id', validateParams(ParamsId), GamesController.getGameById);
