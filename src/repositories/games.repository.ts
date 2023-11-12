import { Game } from '@prisma/client';
import { prisma } from 'database/database';

async function ReadAll(): Promise<Game[]> {
    const result = await prisma.game.findMany();

    return result;
}

async function CheckExistence(id: number) {
    const response = await prisma.bet.findUnique({ where: { id } });

    if (!response) return false;
    return true;
}

// async function ReadById(): Promise<Game & { bets: Bet[] }> {}
// async function Create(): Promise<Game> {}
// async function Finish(): Promise<Game> {}

export const GamesRepository = {
    ReadAll,
    CheckExistence,
};
