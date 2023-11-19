import { Bet, Game } from '@prisma/client';
import { Prisma } from '../database/database';
import { ResourceNotFound } from '../errors';

async function ReadAll(): Promise<Game[]> {
    const games = await Prisma.game.findMany();

    return games;
}

async function ReadById(id: number): Promise<Game & { Bet: Bet[] }> {
    try {
        const gameWithBets = await Prisma.game.findUniqueOrThrow({ where: { id }, include: { Bet: true } });
        return gameWithBets;
    } catch (error) {
        throw ResourceNotFound('Game');
    }
}
async function Create(homeTeamName: string, awayTeamName: string): Promise<Game> {
    const newGame = await Prisma.game.create({
        data: {
            awayTeamName,
            homeTeamName,
            awayTeamScore: 0,
            homeTeamScore: 0,
        },
    });

    return newGame;
}
async function Finish(id: number, homeTeamScore: number, awayTeamScore: number): Promise<Game> {
    try {
        const finishedGame = await Prisma.game.update({
            data: { awayTeamScore, homeTeamScore, isFinished: true },
            where: { id, isFinished: false },
        });
        return finishedGame;
    } catch (error) {
        throw ResourceNotFound('Game', 'or is already finished');
    }
}

export const GamesRepository = {
    ReadAll,
    ReadById,
    Create,
    Finish,
};
