import { Bet } from '@prisma/client';
import { prisma } from '../database/database';
import { resourceNotFound } from '../errors';
import { PostBet } from '../protocols';

async function ReadBetsByGame(gameId: number): Promise<Bet[]> {
    try {
        const result = await prisma.bet.findMany({ where: { gameId } });

        return result;
    } catch (error) {
        throw resourceNotFound('Game');
    }
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

async function Create({ amountBet, awayTeamScore, homeTeamScore, gameId, participantId }: PostBet) {
    const [BetResult] = await prisma.$transaction([
        prisma.bet.create({ data: { amountBet, awayTeamScore, homeTeamScore, gameId, participantId } }),
        prisma.participant.update({ data: { balance: { decrement: amountBet } }, where: { id: participantId } }),
    ]);

    return BetResult;
}

export const BetsRepository = {
    ReadBetsByGame,
    UpdateManyBet,
    UpdateBet,
    Create,
};
