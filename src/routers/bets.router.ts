import { Router } from 'express';
import { BetsController } from '../controllers/bets.controller';
import { ValidateBody } from '../middlewares/validation.middleware';
import { PostBetPayload } from '../schemas/bets.schemas';

export const BetsRouter = Router();

BetsRouter.post('/', ValidateBody(PostBetPayload), BetsController.PostBet);
