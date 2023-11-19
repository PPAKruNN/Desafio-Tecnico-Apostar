import { Participant } from '@prisma/client';
import { InsufficientBalancePolicy } from '../errors';
import { ParticipantsRepository } from '../repositories/participants.repository';

export async function Read(): Promise<Participant[]> {
    const participant: Participant[] = await ParticipantsRepository.ReadMany();

    return participant;
}

export async function Create(name: string, balance: number): Promise<Participant> {
    MinBalancePolicy(balance);

    const newParticipant = await ParticipantsRepository.Create(name, balance);

    return newParticipant;
}

function MinBalancePolicy(balance: number) {
    const minBalance = 10;

    if (balance < minBalance) throw InsufficientBalancePolicy(balance, minBalance);
}

export const ParticipantsService = {
    Read,
    Create,
};
