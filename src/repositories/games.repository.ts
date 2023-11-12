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
// async function Create(): Promise<Game> {}
// async function Finish(): Promise<Game> {}

export const GamesRepository = {
    ReadAll,
    CheckExistence,
    ReadById,
};
