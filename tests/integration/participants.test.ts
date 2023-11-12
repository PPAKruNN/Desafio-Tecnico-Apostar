import supertest from 'supertest';
import httpStatus from 'http-status';
import { faker } from '@faker-js/faker';
import { app } from '../../src/app';
import { cleanDb } from '../helpers';
import { genParticipant, genParticipantPayload } from '../factories/participants.factory';

const server = supertest(app);

beforeEach(async () => {
    await cleanDb();
});

const path = '/participants';

describe(`POST ${path}`, () => {
    test('should be able to create a user', async () => {
        const payload = genParticipantPayload();

        const response = await server.post(path).send(payload);

        expect(response.statusCode).toBe(httpStatus.CREATED);
        expect(response.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                name: payload.name,
                balance: payload.balance,
            }),
        );
    });

    test('should respond 400 when balance is below 10', async () => {
        const payload = genParticipantPayload();
        payload.balance = faker.number.int({ max: 9, min: 0 });

        const response = await server.post(path).send(payload);

        expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
    });

    test('should respond 422 when payload is in a invalid format', async () => {
        const payload = {
            name: faker.number.int(),
            balance: faker.commerce.product(),
        };

        const response = await server.post(path).send(payload);

        expect(response.statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    test('should respond 422 when payload is empty', async () => {
        const payload = {};

        const response = await server.post(path).send(payload);
        const response2 = await server.post(path);

        expect(response.statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        expect(response2.statusCode).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
});

describe(`GET ${path}`, () => {
    test('should return all participants data inside an array and a 200 status', async () => {
        const participant = await genParticipant();

        const response = await server.get(path);

        expect(response.statusCode).toBe(httpStatus.OK);
        expect(response.body).toContainEqual(
            expect.objectContaining({
                id: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                name: participant.name,
                balance: participant.balance,
            }),
        );
    });
});
