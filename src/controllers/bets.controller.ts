import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PostBetType } from '../protocols';
import { BetsService } from '../services/bets.services';

async function PostBet(req: Request, res: Response) {
    const payload = req.body as PostBetType;

    const newBet = await BetsService.Create(payload);

    return res.status(httpStatus.CREATED).send(newBet);
}

export const BetsController = {
    PostBet,
};
