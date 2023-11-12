import { Participant } from '@prisma/client';
import { prisma } from 'database/database';

export async function ReadMany(): Promise<Participant[]> {
    const response = await prisma.participant.findMany();

    return response;
}

export async function Create(name: string, balance: number): Promise<Participant> {
    const response = await prisma.participant.create({ data: { name, balance } });

    return response;
}

export async function UpdateParticipant(amountWon: number, participantId: number) {
    const response = await prisma.participant.update({
        data: { balance: { increment: amountWon } },
        where: { id: participantId },
    });

    return response;
}

export const ParticipantsRepository = {
    ReadMany,
    Create,
    UpdateParticipant,
};
