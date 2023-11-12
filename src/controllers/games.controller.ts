import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PostGame } from 'protocols';
import { GamesService } from 'services/games.services';

async function postGame(req: Request, res: Response) {
    const { homeTeamName, awayTeamName } = req.body as PostGame;

    const response = await GamesService.Create(homeTeamName, awayTeamName);

    return res.status(httpStatus.CREATED).send(response);
}

async function postFinishGame() {}

async function getGames(_req: Request, res: Response) {
    const response = await GamesService.ReadAll();

    return res.send(response);
}

async function getGameById(req: Request, res: Response) {
    const { id } = req.params;
    const response = await GamesService.ReadOne(Number(id));

    return res.send(response);
}

export const GamesController = {
    postGame,
    postFinishGame,
    getGames,
    getGameById,
};
