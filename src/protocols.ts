export type PostParticipant = {
    name: string;
    balance: number;
};

export type PostGame = {
    homeTeamName: string;
    awayTeamName: string;
};

export type PostFinishGame = {
    homeTeamScore: number;
    awayTeamScore: number;
};
