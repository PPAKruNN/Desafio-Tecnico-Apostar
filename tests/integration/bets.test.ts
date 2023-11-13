import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import { Bet } from '@prisma/client';
import httpStatus from 'http-status';
import { cleanDb } from '../helpers';
import { genBetPayload } from '../factories/bet.factory';
import { genFinishedGame, genGame } from '../factories/games.factory';
import { genParticipant } from '../factories/participants.factory';
import { app } from 'app';
import { prisma } from 'database/database';

const server = supertest(app);

const path = '/bets';

beforeAll(async () => {
    await cleanDb();
});

describe(`POST ${path}`, () => {
    test('should create a bet and return 201', async () => {
        const game = await genGame();
        const payload = await genBetPayload({ game });

        // Ensure balance is greater than the amount bet;
        payload.amountBet = 1;

        const response = await server.post(path).send(payload);
        const databaseConfirm = await prisma.bet.findFirst({ where: { participantId: payload.participantId } });

        const objectMatcher: Partial<Bet> = {
            id: expect.any(Number),
            homeTeamScore: payload.homeTeamScore,
            awayTeamScore: payload.awayTeamScore,
            amountBet: payload.amountBet,
            gameId: payload.gameId,
            participantId: payload.participantId,
            status: 'PENDING',
        };

        expect(response.statusCode).toBe(httpStatus.CREATED);
        expect(response.body).toEqual(
            expect.objectContaining({
                ...objectMatcher,
                amountWon: null,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }),
        );

        expect(databaseConfirm).toMatchObject(
            expect.objectContaining({
                ...objectMatcher,
                amountWon: null,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            }),
        );
    });

    test('should discount users balance when creating a bet', async () => {
        const oldParticipant = await genParticipant();

        const payload = await genBetPayload({ participant: oldParticipant });
        await server.post(path).send(payload);

        const newerParticipant = await prisma.participant.findUnique({ where: { id: oldParticipant.id } });
        expect(newerParticipant.balance).toBeLessThan(oldParticipant.balance); // newer < old === old - amountBet < old;
    });

    test('should return 400 if user try to bet more than his balance', async () => {
        const participant = await genParticipant();
        const payload = await genBetPayload({ participant });

        payload.amountBet = participant.balance + 1;

        const response = await server.post(path).send(payload);
        expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if bet in a finished game', async () => {
        const game = await genFinishedGame();
        const payload = await genBetPayload({ game });

        const response = await server.post(path).send(payload);

        expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
    });

    test('should return 404 if participantId or gameId is a invalid id', async () => {
        const payload = await genBetPayload({});

        await prisma.participant.delete({ where: { id: payload.participantId } });
        await prisma.game.delete({ where: { id: payload.gameId } });

        const response = await server.post(path).send(payload);

        expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
    });

    test('should return 422 if payload is invalid or empty', async () => {
        const payload = {
            homeTeamScore: faker.commerce.productAdjective(),
            awayTeamScore: faker.color.lab(),
            amountBet: faker.number.float(),
            gameId: faker.airline.airline(),
            participantId: faker.date.anytime(),
        };

        const responses = await Promise.all([
            await server.post(path).send(payload),
            await server.post(path).send({}),
            await server.post(path),
        ]);

        expect(responses[0].statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        expect(responses[1].statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        expect(responses[2].statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
});
