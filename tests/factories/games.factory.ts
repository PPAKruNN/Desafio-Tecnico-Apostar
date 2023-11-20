import { faker } from '@faker-js/faker';
import { Bet, Game } from '@prisma/client';
import { Prisma } from 'database/database';
import { PostFinishGameType, PostGameType } from 'protocols';

type genGame = {
    bet?: Bet;
};

export function genGamePayload(): PostGameType {
    const payload: PostGameType = {
        homeTeamName: faker.company.name(),
        awayTeamName: faker.company.name(),
    };

    return payload;
}

export async function genGame(): Promise<Game> {
    const payload: PostGameType = {
        homeTeamName: faker.company.name(),
        awayTeamName: faker.company.name(),
    };

    const game = await Prisma.game.create({
        data: {
            ...payload,
            homeTeamScore: 0,
            awayTeamScore: 0,
        },
    });

    return game;
}

export function genFinishGamePayload() {
    const payload: PostFinishGameType = {
        awayTeamScore: faker.number.int({ min: 0, max: 888888 }),
        homeTeamScore: faker.number.int({ min: 0, max: 888888 }),
    };

    return payload;
}

export async function genFinishedGame(): Promise<Game> {
    const payload: PostFinishGameType & PostGameType = {
        homeTeamName: faker.company.name(),
        awayTeamName: faker.company.name(),
        awayTeamScore: faker.number.int({ min: 0, max: 888888 }),
        homeTeamScore: faker.number.int({ min: 0, max: 888888 }),
    };

    const game = await Prisma.game.create({
        data: {
            ...payload,
            isFinished: true,
        },
    });

    return game;
}
