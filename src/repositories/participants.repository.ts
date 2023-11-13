import { Participant } from '@prisma/client';
import { prisma } from '../database/database';
import { resourceNotFound } from '../errors';

export async function ReadMany(): Promise<Participant[]> {
    const result = await prisma.participant.findMany();

    return result;
}

export async function ReadById(id: number) {
    try {
        const result = await prisma.participant.findUniqueOrThrow({ where: { id } });

        return result;
    } catch (error) {
        throw resourceNotFound('Participant');
    }
}

export async function Create(name: string, balance: number): Promise<Participant> {
    const result = await prisma.participant.create({ data: { name, balance } });

    return result;
}

export async function UpdateParticipant(amountWon: number, participantId: number) {
    const result = await prisma.participant.update({
        data: { balance: { increment: amountWon } },
        where: { id: participantId },
    });

    return result;
}

export const ParticipantsRepository = {
    ReadMany,
    ReadById,
    Create,
    UpdateParticipant,
};
