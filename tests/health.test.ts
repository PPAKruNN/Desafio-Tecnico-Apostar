import supertest from 'supertest';
import httpStatus from 'http-status';
import { app } from '../src/app';
import { prisma } from '../src/database/database';
import { cleanDb } from './helpers';

const server = supertest(app);

beforeEach(async () => {
    await cleanDb();
});

describe('Is my application correctly installed?', () => {
    test('Tests should run', () => {
        expect(1).toBe(1);
    });

    test('Should connect to db and be able to perform any operation', async () => {
        // Change this to a model of your prisma schema.
        const response = await prisma.game.findMany();
        expect(response.length).toBe(0);
    });

    test('Should be possible to run the server and GET /health', async () => {
        const response = await server.get('/health');

        expect(response.status).toBe(httpStatus.OK);
        expect(response.text).toBe('Ok!!');
    });
});
