import { faker } from '@faker-js/faker';
import { prisma } from 'database/database';

export function genParticipantPayload() {
    return {
        name: faker.person.fullName(),
        balance: faker.number.int({ min: 10, max: 599999 }),
    };
}

export async function genParticipant() {
    const participant = await prisma.participant.create({
        data: {
            name: faker.person.fullName(),
            balance: faker.number.int({ min: 10, max: 599999 }),
        },
    });

    return participant;
}

// Participante
// Não pode ser criado com menos de 10 reais.
