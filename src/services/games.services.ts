import { Bet, Game } from '@prisma/client';
import { GamesRepository } from 'repositories/games.repository';

async function Create(homeTeamName: string, awayTeamName: string) {
    const result = await GamesRepository.Create(homeTeamName, awayTeamName);

    return result;
}

async function Finish() {}
// Finish SubFunctions
// async function UpdateBets() {}
// async function RewardParticipant() {}
// async function RewardCalculusPolicy() {}

async function ReadAll() {
    const result = await GamesRepository.ReadAll();

    return result;
}
async function ReadOne(id: number) {
    const rawResult = await GamesRepository.ReadById(id);

    const result = formatBetRawResult(rawResult);

    return result;
}

function formatBetRawResult(obj: Game & { Bet: Bet[] }) {
    const bets = obj.Bet;
    delete obj.Bet;

    const newObj: Game & { bets: Bet[] } = { ...obj, bets };

    return newObj;
}

export const GamesService = {
    Create,
    Finish,
    ReadAll,
    ReadOne,
};
