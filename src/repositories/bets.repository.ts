import { Bet } from '@prisma/client';
import { Prisma } from '../database/database';
import { ResourceNotFound } from '../errors';
import { PostBetType } from '../protocols';

async function ReadBetsByGame(gameId: number): Promise<Bet[]> {
    try {
        const bets = await Prisma.bet.findMany({ where: { gameId } });

        return bets;
    } catch (error) {
        throw ResourceNotFound('Game');
    }
}

async function UpdateManyBet(betsId: number[], amountWon: number, status: string) {
    await Prisma.bet.updateMany({
        data: {
            amountWon,
            status,
        },
        where: { id: { in: betsId } },
    });
}

async function UpdateBet(betId: number, amountWon: number, status: string) {
    await Prisma.bet.update({
        data: {
            amountWon,
            status,
        },
        where: { id: betId },
    });
}

async function Create({ amountBet, awayTeamScore, homeTeamScore, gameId, participantId }: PostBetType) {
    const [betResult] = await Prisma.$transaction([
        Prisma.bet.create({ data: { amountBet, awayTeamScore, homeTeamScore, gameId, participantId } }),
        Prisma.participant.update({ data: { balance: { decrement: amountBet } }, where: { id: participantId } }),
    ]);

    return betResult;
}

export const BetsRepository = {
    ReadBetsByGame,
    UpdateManyBet,
    UpdateBet,
    Create,
};
