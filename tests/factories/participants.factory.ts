import { faker } from '@faker-js/faker';
// import { prisma } from '../../src/database/database';

export function genParticipantPayload() {
    return {
        name: faker.person.fullName(),
        balance: faker.number.int({ min: 10 }),
    };
}

// Participante
// Não pode ser criado com menos de 10 reais.
