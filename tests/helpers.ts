import { Prisma } from '../src/database/database';

export async function cleanDb() {
    await Prisma.bet.deleteMany();
    await Prisma.game.deleteMany();
    await Prisma.participant.deleteMany();
}
