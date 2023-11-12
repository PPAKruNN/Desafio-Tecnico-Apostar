import { faker } from '@faker-js/faker';
import { Game, Participant } from '@prisma/client';
import { genParticipant } from './participants.factory';
import { genGame } from './games.factory';
import { prisma } from 'database/database';
import { PostBet } from 'protocols';

type genBet = {
    game?: Game;
    participant?: Participant;
};

export async function genBetPayload({ game, participant }: genBet): Promise<PostBet> {
    const author = participant ?? (await genParticipant());
    const newGame = game ?? (await genGame());

    const payload: PostBet = {
        gameId: newGame.id,
        participantId: author.id,
        awayTeamScore: faker.number.int({ max: 1000000 }),
        homeTeamScore: faker.number.int({ max: 1000000 }),
        amountBet: faker.number.int({ max: 1000000 }),
    };

    return payload;
}

export async function genBet({ game, participant }: genBet) {
    const author = participant ?? (await genParticipant());
    const newGame = game ?? (await genGame());

    const response = await prisma.bet.create({
        data: {
            game: { connect: newGame },
            participant: { connect: author },
            awayTeamScore: faker.number.int({ max: 1000000 }),
            homeTeamScore: faker.number.int({ max: 1000000 }),
            amountBet: faker.number.int({ max: 1000000 }),
            amountWon: -1,
        },
    });

    return response;
}
