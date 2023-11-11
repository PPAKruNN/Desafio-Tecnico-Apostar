import { Participant } from '@prisma/client';
import { ParticipantsRepository } from 'repositories/participants.repository';

export async function ReadAll(): Promise<Participant[]> {
    const response: Participant[] = await ParticipantsRepository.ReadMany();

    return response;
}

export const ParticipantsService = {
    ReadAll,
};
