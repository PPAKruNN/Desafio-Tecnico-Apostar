import supertest from 'supertest';
import { Bet, Game } from '@prisma/client';
import httpStatus from 'http-status';
import { faker } from '@faker-js/faker';
import { genFinishGamePayload, genFinishedGame, genGame, genGamePayload } from '../factories/games.factory';
import { cleanDb } from '../helpers';
import { genBet } from '../factories/bet.factory';
import { genParticipant } from '../factories/participants.factory';
import { app } from 'app';
import { Prisma } from 'database/database';

const server = supertest(app);

const path = '/games';

beforeEach(async () => {
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
            expect(result.body).toEqual(
                expect.objectContaining<Game>({
                    id: game.id,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    homeTeamName: game.homeTeamName,
                    awayTeamName: game.awayTeamName,
                    homeTeamScore: payload.homeTeamScore,
                    awayTeamScore: payload.awayTeamScore,
                    isFinished: true,
                }),
            );
        });

        test('should respond with 404 if try to finish a game that is already finished', async () => {
            const game = await genFinishedGame();
            const payload = genFinishGamePayload();

            const result = await server.post(`${path}/${game.id}/finish`).send(payload);
            expect(result.statusCode).toBe(httpStatus.NOT_FOUND);
        });

        test("should update game's bets status and amountWon", async () => {
            const game = await genGame();
            const bet1 = await genBet({ game });
            const bet2 = await genBet({ game });

            // The game result are going to be equal to bet1 prediction.
            const payload = genFinishGamePayload();
            payload.awayTeamScore = bet1.awayTeamScore;
            payload.homeTeamScore = bet1.homeTeamScore;

            await server.post(`${path}/${game.id}/finish`).send(payload);

            const updatedBet1 = await Prisma.bet.findUnique({ where: { id: bet1.id } });
            const updatedBet2 = await Prisma.bet.findUnique({ where: { id: bet2.id } });

            expect(updatedBet1.status).toBe('WON');
            expect(updatedBet2.status).toBe('LOST');

            expect(updatedBet1.amountWon).toBeGreaterThan(0);
            expect(updatedBet2.amountWon).toBe(0);
        });

        test("should affect game's participants balance if they won", async () => {
            const game = await genGame();
            const oldParticipant = await genParticipant();
            const bet = await genBet({ participant: oldParticipant, game });

            // The game result are going to be equal to bet prediction.
            const payload = genFinishGamePayload();
            payload.awayTeamScore = bet.awayTeamScore;
            payload.homeTeamScore = bet.homeTeamScore;

            await server.post(`${path}/${game.id}/finish`).send(payload);

            const updatedParticipant = await Prisma.participant.findUnique({ where: { id: oldParticipant.id } });

            expect(updatedParticipant.balance).toBeGreaterThan(oldParticipant.balance);
        });

        test('should return 404 if id is invalid', async () => {
            const game = await genGame();
            await Prisma.game.delete({ where: { id: game.id } });
            const payload = await genFinishGamePayload();

            const result = await server.post(`${path}/${game.id}/finish`).send(payload);
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
});

describe(`GET ${path}`, () => {
    test('Should get all registered games', async () => {
        const newGame = await genGame();

        const response = await server.get(path);

        expect(response.statusCode).toBe(httpStatus.OK);
        expect(response.body).toContainEqual({
            ...newGame,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
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
            expect(response.body).toEqual({
                ...newGame,
                bets: expect.arrayContaining<Bet>([
                    {
                        ...bet,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    },
                ]),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            });
        });

        test('Should return a game data with a empty bet array', async () => {
            const newGame = await genGame();

            const response = await server.get(`${path}/${newGame.id}`);

            expect(response.statusCode).toBe(httpStatus.OK);
            expect(response.body).toEqual({
                ...newGame,
                bets: [],
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            });
        });

        test('Should return 422 if id is in invalid format', async () => {
            const response = await server.get(`${path}/${-faker.number.float({ max: 8888888 })}`);
            expect(response.statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        });

        test("Should return 404 if id doesn't exist", async () => {
            const newGame = await genGame();
            await Prisma.game.delete({ where: { id: newGame.id } });

            const response = await server.get(`${path}/${newGame.id}`);
            expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
        });
    });
});
