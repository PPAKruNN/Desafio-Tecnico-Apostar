import { Router } from 'express';
import { ParticipantsController } from '../controllers/participants.controller';
import { validateBody } from '../middlewares/validation.middleware';
import { postPayloadSchema } from '../schemas/participants.schemas';

export const ParticipantsRouter = Router();

ParticipantsRouter.get('/', ParticipantsController.getAll).post(
    '/',
    validateBody(postPayloadSchema),
    ParticipantsController.postParticipant,
);
