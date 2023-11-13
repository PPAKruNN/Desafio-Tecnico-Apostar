import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PostParticipant } from 'protocols';
import { ParticipantsService } from 'services/participants.services';

export async function getAll(_req: Request, res: Response) {
    const response = await ParticipantsService.Read();

    return res.send(response);
}

export async function postParticipant(req: Request, res: Response) {
    const { name, balance } = req.body as PostParticipant;

    const participant = await ParticipantsService.Create(name, balance);

    return res.status(httpStatus.CREATED).send(participant);
}

export const ParticipantsController = {
    getAll,
    postParticipant,
};
