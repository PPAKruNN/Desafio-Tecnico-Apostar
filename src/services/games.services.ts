import { Bet, Game } from '@prisma/client';
import { BetsRepository } from '../repositories/bets.repository';
import { GamesRepository } from '../repositories/games.repository';
import { ParticipantsRepository } from '../repositories/participants.repository';

export type RewardType = {
    amountWon: number;
    participantId: number;
    id: number;
};

async function Create(homeTeamName: string, awayTeamName: string) {
    const newGame = await GamesRepository.Create(homeTeamName, awayTeamName);

    return newGame;
}

async function Finish(id: number, homeTeamScore: number, awayTeamScore: number) {
    const finishedGame = await GamesRepository.Finish(id, homeTeamScore, awayTeamScore);

    await UpdateBets(finishedGame);

    return finishedGame;
}

async function UpdateBets(game: Game) {
    const bets = await BetsRepository.ReadBetsByGame(game.id);

    const winners: Bet[] = [];
    const loosers: number[] = [];
    let betSum = 0;
    let winnerBetSum = 0;

    bets.forEach((bet) => {
        if (bet.homeTeamScore === game.homeTeamScore && bet.awayTeamScore === game.awayTeamScore) {
            betSum += bet.amountBet;
            winnerBetSum += bet.amountBet;

            winners.push(bet);
        } else {
            betSum += bet.amountBet;
            loosers.push(bet.id);
        }
    });

    // Update Loosers Bets.
    await BetsRepository.UpdateManyBet(loosers, 0, 'LOST');

    // TODO: calcular amountWon, update nas bet winner com o amountWon e 'WON'. >> depois, update nos participants balance.

    const rewards = RewardCalculusPolicy(winners, betSum, winnerBetSum);
    await UpdateWinners(rewards);
}

function RewardCalculusPolicy(bets: Bet[], betSum: number, winnerBetSum: number) {
    const tax = 0.3;

    const rewards = bets.map((bet) => {
        bet.amountWon = Math.ceil((bet.amountBet / winnerBetSum) * betSum * (1 - tax));
        return { amountWon: bet.amountWon, participantId: bet.participantId, id: bet.id };
    });

    return rewards;
}

async function UpdateWinners(rewards: RewardType[]) {
    const promises = [];

    for (let i = 0; i < rewards.length; i++) {
        const current = rewards[i];

        const betPromise = BetsRepository.UpdateBet(current.id, current.amountWon, 'WON');
        const participantPromise = ParticipantsRepository.UpdateParticipant(current.amountWon, current.participantId);
        promises.push(betPromise);
        promises.push(participantPromise);
    }

    // Await all updates before going on.
    await Promise.all(promises);
}

async function ReadAll() {
    const result = await GamesRepository.ReadAll();

    return result;
}
async function ReadOne(id: number) {
    const rawResult = await GamesRepository.ReadById(id);

    const result = FormatBetRawResult(rawResult);

    return result;
}

function FormatBetRawResult(obj: Game & { Bet: Bet[] }) {
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
