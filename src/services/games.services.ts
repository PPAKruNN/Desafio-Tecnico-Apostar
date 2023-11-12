import { GamesRepository } from 'repositories/games.repository';

async function Create() {}

async function Finish() {}
// Finish SubFunctions
// async function UpdateBets() {}
// async function RewardParticipant() {}
// async function RewardCalculusPolicy() {}

async function ReadAll() {
    const response = await GamesRepository.ReadAll();

    return response;
}
async function ReadOne() {}

export const GamesService = {
    Create,
    Finish,
    ReadAll,
    ReadOne,
};
