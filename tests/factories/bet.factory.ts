import { faker } from '@faker-js/faker';
import { Game, Participant } from '@prisma/client';
import { genParticipant } from './participants.factory';
import { genGame } from './games.factory';
import { Prisma } from 'database/database';
import { PostBetType } from 'protocols';

type genBet = {
    game?: Game;
    participant?: Participant;
};

export async function genBetPayload({ game, participant }: genBet): Promise<PostBetType> {
    const author = participant ?? (await genParticipant());
    const newGame = game ?? (await genGame());

    const payload: PostBetType = {
        gameId: newGame.id,
        participantId: author.id,
        awayTeamScore: faker.number.int({ min: 0, max: 1000000 }),
        homeTeamScore: faker.number.int({ min: 0, max: 1000000 }),
        amountBet: faker.number.int({ min: 0, max: author.balance }),
    };

    return payload;
}

export async function genBet({ game, participant }: genBet) {
    const author = participant ?? (await genParticipant());
    const newGame = game ?? (await genGame());

    const response = await Prisma.bet.create({
        data: {
            game: { connect: newGame },
            participant: { connect: author },
            awayTeamScore: faker.number.int({ min: 0, max: 1000000 }),
            homeTeamScore: faker.number.int({ min: 0, max: 1000000 }),
            amountBet: faker.number.int({ min: 0, max: author.balance }),
        },
    });

    return response;
}
