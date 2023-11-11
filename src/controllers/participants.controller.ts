import { Request, Response } from 'express';
import { ParticipantsService } from 'services/participants.service';

export async function getAll(_req: Request, res: Response) {
    const response = await ParticipantsService.ReadAll();

    return res.send(response);
}

export const ParticipantsController = {
    getAll,
};
