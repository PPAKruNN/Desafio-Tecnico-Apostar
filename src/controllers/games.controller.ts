import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { GamesService } from '../services/games.services';
import { PostFinishGameType, PostGameType } from '../protocols';

async function PostGame(req: Request, res: Response) {
    const { homeTeamName, awayTeamName } = req.body as PostGameType;

    const newGame = await GamesService.Create(homeTeamName, awayTeamName);

    return res.status(httpStatus.CREATED).send(newGame);
}

async function PostFinishGame(req: Request, res: Response) {
    const { id } = req.params;
    const { awayTeamScore, homeTeamScore } = req.body as PostFinishGameType;

    const finishedGame = await GamesService.Finish(Number(id), homeTeamScore, awayTeamScore);

    return res.send(finishedGame);
}

async function GetGames(_req: Request, res: Response) {
    const games = await GamesService.ReadAll();

    return res.send(games);
}

async function GetGameById(req: Request, res: Response) {
    const { id } = req.params;
    const gameWithBets = await GamesService.ReadOne(Number(id));

    return res.send(gameWithBets);
}

export const GamesController = {
    PostGame,
    PostFinishGame,
    GetGames,
    GetGameById,
};
