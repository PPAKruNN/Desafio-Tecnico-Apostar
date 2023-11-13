import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PostBet } from '../protocols';
import { BetsService } from '../services/bets.services';

async function postBet(req: Request, res: Response) {
    const payload = req.body as PostBet;

    const response = await BetsService.Create(payload);

    return res.status(httpStatus.CREATED).send(response);
}

export const BetsController = {
    postBet,
};
