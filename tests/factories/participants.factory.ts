import { faker } from '@faker-js/faker';
import { prisma } from 'database/database';
import { PostParticipant } from 'protocols';

export function genParticipantPayload() {
    const payload: PostParticipant = {
        name: faker.person.fullName(),
        balance: faker.number.int({ min: 10, max: 599999 }),
    };

    return payload;
}

export async function genParticipant() {
    const payload: PostParticipant = {
        name: faker.person.fullName(),
        balance: faker.number.int({ min: 10, max: 599999 }),
    };

    const participant = await prisma.participant.create({
        data: payload,
    });

    return participant;
}
