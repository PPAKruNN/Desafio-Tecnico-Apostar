import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import { Bet } from '@prisma/client';
import httpStatus from 'http-status';
import { CleanDb } from '../helpers';
import { GenBetPayload } from '../factories/bet.factory';
import { GenFinishedGame, GenGame } from '../factories/games.factory';
import { GenParticipant } from '../factories/participants.factory';
import { app } from 'app';
import { Prisma } from 'database/database';

const server = supertest(app);

const path = '/bets';

beforeAll(async () => {
    await CleanDb();
});

describe(`POST ${path}`, () => {
    test('should create a bet and return 201', async () => {
        const game = await GenGame();
        const payload = await GenBetPayload({ game });

        // Ensure balance is greater than the amount bet;
        payload.amountBet = 1;

        const response = await server.post(path).send(payload);
        const databaseConfirm = await Prisma.bet.findFirst({ where: { participantId: payload.participantId } });

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
        const oldParticipant = await GenParticipant();

        const payload = await GenBetPayload({ participant: oldParticipant });
        await server.post(path).send(payload);

        const newerParticipant = await Prisma.participant.findUnique({ where: { id: oldParticipant.id } });
        expect(newerParticipant.balance).toBeLessThan(oldParticipant.balance); // newer < old === old - amountBet < old;
    });

    test('should return 400 if user try to bet more than his balance', async () => {
        const participant = await GenParticipant();
        const payload = await GenBetPayload({ participant });

        payload.amountBet = participant.balance + 1;

        const response = await server.post(path).send(payload);
        expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if bet in a finished game', async () => {
        const game = await GenFinishedGame();
        const payload = await GenBetPayload({ game });

        const response = await server.post(path).send(payload);

        expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
    });

    test('should return 404 if participantId or gameId is a invalid id', async () => {
        const payload = await GenBetPayload({});

        await Prisma.participant.delete({ where: { id: payload.participantId } });
        await Prisma.game.delete({ where: { id: payload.gameId } });

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
