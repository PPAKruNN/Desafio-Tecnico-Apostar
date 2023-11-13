import { Router } from 'express';
import { BetsController } from 'controllers/bets.controller';
import { validateBody } from 'middlewares/validation.middleware';
import { postBetPayload } from 'schemas/bets.schemas';

export const BetsRouter = Router();

BetsRouter.post('/', validateBody(postBetPayload), BetsController.postBet);
