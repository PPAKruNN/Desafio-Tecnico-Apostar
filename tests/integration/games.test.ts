import supertest from 'supertest';
import { Game } from '@prisma/client';
import httpStatus from 'http-status';
import { faker } from '@faker-js/faker';
import { genFinishGamePayload, genGame, genGamePayload } from '../factories/games.factory';
import { cleanDb } from '../helpers';
import { genBet } from '../factories/bet.factory';
import { app } from 'app';
import { prisma } from 'database/database';

const server = supertest(app);

const path = '/games';

beforeAll(async () => {
    await cleanDb();
});

describe(`POST ${path}`, () => {
    test('Should create a game and return 201', async () => {
        const payload = await genGamePayload();

        const response = await server.post(path).send(payload);

        expect(response.statusCode).toBe(httpStatus.CREATED);
        expect(response.body).toEqual(
            expect.objectContaining<Game>({
                id: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                homeTeamName: payload.homeTeamName,
                awayTeamName: payload.awayTeamName,
                homeTeamScore: 0,
                awayTeamScore: 0,
                isFinished: false,
            }),
        );
    });

    test('Should respond 422 if input is invalid or empty', async () => {
        const invalidPayload = {
            homeTeamName: faker.color.lch(),
            awayTeamName: faker.number.int(),
        };

        const results = await Promise.all([
            server.post(path).send(invalidPayload),
            server.post(path).send({}),
            server.post(path),
        ]);

        expect(results[0].statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        expect(results[1].statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        expect(results[2].statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    describe(`POST ${path}/:id/finish`, () => {
        test('should finish a game', async () => {
            const game = await genGame();
            const payload = genFinishGamePayload();

            const result = await server.post(`${path}/${game.id}/finish`).send(payload);
            expect(result.statusCode).toBe(httpStatus.OK);
            expect(result).toEqual(
                expect.objectContaining<Game>({
                    id: game.id,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    homeTeamName: game.homeTeamName,
                    awayTeamName: game.awayTeamName,
                    homeTeamScore: payload.awayTeamScore,
                    awayTeamScore: payload.awayTeamScore,
                    isFinished: true,
                }),
            );
        });
    });

    test('should return 404 if id is invalid', async () => {
        const game = await genGame();
        await prisma.game.delete({ where: { id: game.id } });

        const result = await server.post(`${path}/${game.id}/finish`);
        expect(result.statusCode).toBe(httpStatus.NOT_FOUND);
    });

    test('should return 422 if data is in invalid format or empty', async () => {
        const game = await genGame();

        const invalidPayload = {
            homeTeamName: faker.color.lch(),
            awayTeamName: faker.commerce.department(),
        };

        const results = await Promise.all([
            server.post(`${path}/${game.id}/finish`).send(invalidPayload),
            server.post(`${path}/${game.id}/finish`).send({}),
            server.post(`${path}/${game.id}/finish`),
        ]);

        expect(results[0].statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        expect(results[1].statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        expect(results[2].statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
});

describe(`GET ${path}`, () => {
    test('Should get all registered games', async () => {
        const newGame = await genGame();

        const response = await server.get(path);

        expect(response.statusCode).toBe(httpStatus.OK);
        expect(response.body).toContainEqual(expect.objectContaining(newGame));
    });

    test("Should return 200 with empty array if doesn't have games registered games", async () => {
        const response = await server.get(path);

        expect(response.statusCode).toBe(httpStatus.OK);
        expect(response.body.length).toEqual(0);
    });

    describe(`GET ${path}/:id`, () => {
        test('Should return a game data with its bets', async () => {
            const newGame = await genGame();
            const bet = await genBet({ game: newGame });

            const response = await server.get(`${path}/${newGame.id}`);

            expect(response.statusCode).toBe(httpStatus.OK);
            expect(response).toEqual(
                expect.objectContaining({
                    ...newGame,
                    bets: expect.arrayContaining(expect.objectContaining(bet)),
                }),
            );
        });

        test('Should return a game data with a empty bet array', async () => {
            const newGame = await genGame();

            const response = await server.get(`${path}/${newGame.id}`);

            expect(response.statusCode).toBe(httpStatus.OK);
            expect(response).toEqual(
                expect.objectContaining({
                    ...newGame,
                    bets: [],
                }),
            );
        });

        test("Should return 404 if id doesn't exist", async () => {
            const newGame = await genGame();
            await prisma.game.delete({ where: { id: newGame.id } });

            const response = await server.get(`${path}/${newGame.id}`);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        });
    });
});
