import { Router } from 'express';
import { ParticipantsController } from '../controllers/participants.controller';
import { ValidateBody } from '../middlewares/validation.middleware';
import { PostPayloadSchema } from '../schemas/participants.schemas';

export const ParticipantsRouter = Router();

ParticipantsRouter.get('/', ParticipantsController.GetAll).post(
    '/',
    ValidateBody(PostPayloadSchema),
    ParticipantsController.PostParticipant,
);
