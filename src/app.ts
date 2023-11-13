import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/error-handler.middleware';
import { ParticipantsRouter } from './routers/participants.router';
import { GamesRouter } from './routers/games.router';
import { BetsRouter } from './routers/bets.router';

dotenv.config();
const app = express();

app.use(cors())
    .use(express.json())
    .get('/health', (_req, res) => res.send('Ok!!'))
    .use('/participants', ParticipantsRouter)
    .use('/games', GamesRouter)
    .use('/bets', BetsRouter)
    .use(errorHandler);

export { app };
