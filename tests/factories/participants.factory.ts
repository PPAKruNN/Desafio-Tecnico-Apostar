import { faker } from '@faker-js/faker';
import { Prisma } from 'database/database';
import { PostParticipantType } from 'protocols';

export function genParticipantPayload() {
    const payload: PostParticipantType = {
        name: faker.person.fullName(),
        balance: faker.number.int({ min: 10, max: 599999 }),
    };

    return payload;
}

export async function genParticipant() {
    const payload: PostParticipantType = {
        name: faker.person.fullName(),
        balance: faker.number.int({ min: 10, max: 599999 }),
    };

    const participant = await Prisma.participant.create({
        data: payload,
    });

    return participant;
}
