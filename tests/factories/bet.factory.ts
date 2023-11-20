import { faker } from '@faker-js/faker';
import { Game, Participant } from '@prisma/client';
import { GenParticipant } from './participants.factory';
import { GenGame } from './games.factory';
import { Prisma } from 'database/database';
import { PostBetType } from 'protocols';

type GenBetType = {
    game?: Game;
    participant?: Participant;
};

export async function GenBetPayload({ game, participant }: GenBetType): Promise<PostBetType> {
    const author = participant ?? (await GenParticipant());
    const newGame = game ?? (await GenGame());

    const payload: PostBetType = {
        gameId: newGame.id,
        participantId: author.id,
        awayTeamScore: faker.number.int({ min: 0, max: 1000000 }),
        homeTeamScore: faker.number.int({ min: 0, max: 1000000 }),
        amountBet: faker.number.int({ min: 0, max: author.balance }),
    };

    return payload;
}

export async function GenBet({ game, participant }: GenBetType) {
    const author = participant ?? (await GenParticipant());
    const newGame = game ?? (await GenGame());

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
