import { GameAlreadyFinished, InsufficientBalanceToBet } from '../errors';
import { PostBetType } from '../protocols';
import { BetsRepository } from '../repositories/bets.repository';
import { GamesRepository } from '../repositories/games.repository';
import { ParticipantsRepository } from '../repositories/participants.repository';

async function Create(data: PostBetType) {
    await CheckBetPrerequisites(data.gameId, data.participantId, data.amountBet);

    const newBet = await BetsRepository.Create(data);

    return newBet;
}

async function CheckBetPrerequisites(gameId: number, participantId: number, amountToBet: number) {
    const participant = await ParticipantsRepository.ReadById(participantId);
    if (participant.balance < amountToBet) throw InsufficientBalanceToBet(participant.balance, amountToBet);

    const game = await GamesRepository.ReadById(gameId);
    if (game.isFinished) throw GameAlreadyFinished();
}

export const BetsService = {
    Create,
};
