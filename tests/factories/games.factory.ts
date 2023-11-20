import { faker } from '@faker-js/faker';
import { Game } from '@prisma/client';
import { Prisma } from 'database/database';
import { PostFinishGameType, PostGameType } from 'protocols';

export function GenGamePayload(): PostGameType {
    const payload: PostGameType = {
        homeTeamName: faker.company.name(),
        awayTeamName: faker.company.name(),
    };

    return payload;
}

export async function GenGame(): Promise<Game> {
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

export function GenFinishGamePayload() {
    const payload: PostFinishGameType = {
        awayTeamScore: faker.number.int({ min: 0, max: 888888 }),
        homeTeamScore: faker.number.int({ min: 0, max: 888888 }),
    };

    return payload;
}

export async function GenFinishedGame(): Promise<Game> {
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
