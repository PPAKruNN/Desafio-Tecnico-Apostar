import { Router } from 'express';
import { GamesController } from '../controllers/games.controller';
import { ValidateBody, ValidateParams } from '../middlewares/validation.middleware';
import { ParamsId } from '../schemas/utils.schema';
import { PostFinishGamePayload, PostGamePayload } from '../schemas/games.schemas';

export const GamesRouter = Router();

GamesRouter.get('/', GamesController.GetGames)
    .get('/:id', ValidateParams(ParamsId), GamesController.GetGameById)
    .post('/', ValidateBody(PostGamePayload), GamesController.PostGame)
    .post('/:id/finish', ValidateParams(ParamsId), ValidateBody(PostFinishGamePayload), GamesController.PostFinishGame);
