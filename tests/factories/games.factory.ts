import { faker } from '@faker-js/faker';
import { Bet, Game } from '@prisma/client';
import { prisma } from 'database/database';
import { PostFinishGame, PostGame } from 'protocols';

type genGame = {
    bet?: Bet;
};

export function genGamePayload(): PostGame {
    const payload: PostGame = {
        homeTeamName: faker.company.name(),
        awayTeamName: faker.company.name(),
    };

    return payload;
}

export async function genGame(): Promise<Game> {
    const payload: PostGame = {
        homeTeamName: faker.company.name(),
        awayTeamName: faker.company.name(),
    };

    const game = await prisma.game.create({
        data: {
            ...payload,
            homeTeamScore: 0,
            awayTeamScore: 0,
        },
    });

    return game;
}

export function genFinishGamePayload() {
    const payload: PostFinishGame = {
        awayTeamScore: faker.number.int({ min: 0, max: 888888 }),
        homeTeamScore: faker.number.int({ min: 0, max: 888888 }),
    };

    return payload;
}

export async function genFinishedGame(): Promise<Game> {
    const payload: PostFinishGame & PostGame = {
        homeTeamName: faker.company.name(),
        awayTeamName: faker.company.name(),
        awayTeamScore: faker.number.int({ min: 0, max: 888888 }),
        homeTeamScore: faker.number.int({ min: 0, max: 888888 }),
    };

    const game = await prisma.game.create({
        data: {
            ...payload,
            isFinished: true,
        },
    });

    return game;
}
