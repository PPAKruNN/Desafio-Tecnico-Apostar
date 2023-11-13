import { gameAlreadyFinished, insufficientBalanceToBet } from '../errors';
import { PostBet } from '../protocols';
import { BetsRepository } from '../repositories/bets.repository';
import { GamesRepository } from '../repositories/games.repository';
import { ParticipantsRepository } from '../repositories/participants.repository';

async function Create(data: PostBet) {
    await CheckBetPrerequisites(data.gameId, data.participantId, data.amountBet);

    const result = await BetsRepository.Create(data);

    return result;
}

async function CheckBetPrerequisites(gameId: number, participantId: number, amountToBet: number) {
    const participant = await ParticipantsRepository.ReadById(participantId);
    if (participant.balance < amountToBet) throw insufficientBalanceToBet(participant.balance, amountToBet);

    const game = await GamesRepository.ReadById(gameId);
    if (game.isFinished) throw gameAlreadyFinished();
}

export const BetsService = {
    Create,
};
