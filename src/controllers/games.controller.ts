import { Request, Response } from 'express';
import { GamesService } from 'services/games.services';

async function postGame() {}

async function postFinishGame() {}

async function getGames(_req: Request, res: Response) {
    const response = await GamesService.ReadAll();

    return res.send(response);
}

async function getGameById() {}

export const GamesController = {
    postGame,
    postFinishGame,
    getGames,
    getGameById,
};
