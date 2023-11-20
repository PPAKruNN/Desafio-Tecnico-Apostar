import { Prisma } from '../src/database/database';

export async function CleanDb() {
    await Prisma.bet.deleteMany();
    await Prisma.game.deleteMany();
    await Prisma.participant.deleteMany();
}
