import { Bet } from '@prisma/client';
import { prisma } from 'database/database';

async function ReadBetsByGame(gameId: number): Promise<Bet[]> {
    const result = await prisma.bet.findMany({ where: { gameId } });

    return result;
}

async function UpdateManyBet(betsId: number[], amountWon: number, status: string) {
    await prisma.bet.updateMany({
        data: {
            amountWon,
            status,
        },
        where: { id: { in: betsId } },
    });
}

async function UpdateBet(betId: number, amountWon: number, status: string) {
    await prisma.bet.update({
        data: {
            amountWon,
            status,
        },
        where: { id: betId },
    });
}

export const BetsRepository = {
    ReadBetsByGame,
    UpdateManyBet,
    UpdateBet,
};
