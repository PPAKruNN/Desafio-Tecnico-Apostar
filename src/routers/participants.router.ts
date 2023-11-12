import { Router } from 'express';
import { ParticipantsController } from 'controllers/participants.controller';
import { validateBody } from 'middlewares/validation.middleware';
import { postPayloadSchema } from 'schemas/participants.schemas';

// TODO: create validate schema.

export const participantsRouter = Router();

participantsRouter
    .get('/', ParticipantsController.getAll)
    .post('/', validateBody(postPayloadSchema), ParticipantsController.postParticipant);
