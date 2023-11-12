import { Bet, Game } from '@prisma/client';
import { prisma } from 'database/database';
import { resourceNotFound } from 'errors';

async function ReadAll(): Promise<Game[]> {
    const result = await prisma.game.findMany();

    return result;
}

async function CheckExistence(id: number) {
    const result = await prisma.bet.findUnique({ where: { id } });

    if (!result) return false;
    return true;
}

async function ReadById(id: number): Promise<Game & { Bet: Bet[] }> {
    try {
        const result = await prisma.game.findUniqueOrThrow({ where: { id }, include: { Bet: true } });
        return result;
    } catch (error) {
        throw resourceNotFound('Game');
    }
}
async function Create(homeTeamName: string, awayTeamName: string): Promise<Game> {
    const result = await prisma.game.create({
        data: {
            awayTeamName,
            homeTeamName,
            awayTeamScore: 0,
            homeTeamScore: 0,
        },
    });

    return result;
}
async function Finish(id: number, homeTeamScore: number, awayTeamScore: number): Promise<Game> {
    try {
        const result = await prisma.game.update({
            data: { awayTeamScore, homeTeamScore, isFinished: true },
            where: { id, isFinished: false },
        });
        return result;
    } catch (error) {
        throw resourceNotFound('Game', 'or is already finished');
    }
}

export const GamesRepository = {
    ReadAll,
    CheckExistence,
    ReadById,
    Create,
    Finish,
};
