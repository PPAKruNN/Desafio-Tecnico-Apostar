import { Participant } from '@prisma/client';
import { Prisma } from '../database/database';
import { ResourceNotFound } from '../errors';

export async function ReadMany(): Promise<Participant[]> {
    const participants = await Prisma.participant.findMany();

    return participants;
}

export async function ReadById(id: number) {
    try {
        const participant = await Prisma.participant.findUniqueOrThrow({ where: { id } });

        return participant;
    } catch (error) {
        throw ResourceNotFound('Participant');
    }
}

export async function Create(name: string, balance: number): Promise<Participant> {
    const newParticipant = await Prisma.participant.create({ data: { name, balance } });

    return newParticipant;
}

export async function UpdateParticipant(amountWon: number, participantId: number) {
    const participant = await Prisma.participant.update({
        data: { balance: { increment: amountWon } },
        where: { id: participantId },
    });

    return participant;
}

export const ParticipantsRepository = {
    ReadMany,
    ReadById,
    Create,
    UpdateParticipant,
};
