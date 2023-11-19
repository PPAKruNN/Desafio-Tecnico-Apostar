import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PostParticipantType } from '../protocols';
import { ParticipantsService } from '../services/participants.services';

export async function GetAll(_req: Request, res: Response) {
    const participants = await ParticipantsService.Read();

    return res.send(participants);
}

export async function PostParticipant(req: Request, res: Response) {
    const { name, balance } = req.body as PostParticipantType;

    const newParticipant = await ParticipantsService.Create(name, balance);

    return res.status(httpStatus.CREATED).send(newParticipant);
}

export const ParticipantsController = {
    GetAll,
    PostParticipant,
};
