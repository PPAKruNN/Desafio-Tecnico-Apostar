import { Participant } from '@prisma/client';
import { prisma } from 'database/database';

export async function ReadMany(): Promise<Participant[]> {
    const response = await prisma.participant.findMany();

    return response;
}

export const ParticipantsRepository = {
    ReadMany,
};
