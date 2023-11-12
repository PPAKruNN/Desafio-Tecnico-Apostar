import { Router } from 'express';
import { GamesController } from 'controllers/games.controller';

export const GamesRouter = Router();

GamesRouter.get('/', GamesController.getGames);
