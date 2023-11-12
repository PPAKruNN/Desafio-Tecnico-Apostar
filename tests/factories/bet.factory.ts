import { faker } from '@faker-js/faker';
import { Game, Participant } from '@prisma/client';
import { genParticipant } from './participants.factory';
import { genGame } from './games.factory';
import { prisma } from 'database/database';

type genBet = {
    game?: Game;
    participant?: Participant;
};

export async function genBet({ game, participant }: genBet) {
    const author = participant ?? (await genParticipant());
    const newGame = game ?? (await genGame());

    const response = await prisma.bet.create({
        data: {
            game: { connect: newGame },
            participant: { connect: author },
            awayTeamScore: faker.number.int(),
            homeTeamScore: faker.number.int(),
            amountBet: faker.number.int(),
            amountWon: null,
        },
    });

    return response;
}
