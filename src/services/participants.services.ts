import { Participant } from '@prisma/client';
import { insufficientBalancePolicy } from 'errors';
import { ParticipantsRepository } from 'repositories/participants.repository';

export async function Read(): Promise<Participant[]> {
    const response: Participant[] = await ParticipantsRepository.ReadMany();

    return response;
}

export async function Create(name: string, balance: number): Promise<Participant> {
    minBalancePolicy(balance);

    const newParticipant = await ParticipantsRepository.Create(name, balance);

    return newParticipant;
}

function minBalancePolicy(balance: number) {
    const minBalance = 10;

    if (balance < minBalance) throw insufficientBalancePolicy(balance, minBalance);
}

export const ParticipantsService = {
    Read,
    Create,
};
