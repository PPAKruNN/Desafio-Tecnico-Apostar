import { Router } from 'express';
import { ParticipantsController } from 'controllers/participants.controller';

// TODO: create validate schema.

export const participantsRouter = Router();

participantsRouter.get('/', ParticipantsController.getAll);
