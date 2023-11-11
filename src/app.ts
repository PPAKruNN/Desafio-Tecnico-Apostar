import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import dotenv from 'dotenv';
import { participantsRouter } from 'routers';
import { errorHandler } from 'middlewares';

dotenv.config();
const app = express();

app.use(cors())
    .use(express.json())
    .get('/health', (_req, res) => res.send('Ok!!'))
    .use('/participants', participantsRouter)
    .use(errorHandler);

export { app };
