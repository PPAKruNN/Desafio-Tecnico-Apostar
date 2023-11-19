export type PostParticipantType = {
    name: string;
    balance: number;
};

export type PostGameType = {
    homeTeamName: string;
    awayTeamName: string;
};

export type PostFinishGameType = {
    homeTeamScore: number;
    awayTeamScore: number;
};

export type PostBetType = {
    homeTeamScore: number;
    awayTeamScore: number;
    amountBet: number;
    gameId: number;
    participantId: number;
};
