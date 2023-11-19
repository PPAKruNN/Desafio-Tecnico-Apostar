import httpStatus from 'http-status';

export class ApplicationError extends Error {
    statusCode: number;

    constructor(statusCode: number, name: string, message: string) {
        super(message);

        this.name = name;
        this.message = message;
        this.statusCode = statusCode;
    }
}

export function InvalidDataError(message: string) {
    return new ApplicationError(httpStatus.UNPROCESSABLE_ENTITY, 'Invalid payload format', message);
}

export function InsufficientBalancePolicy(balance: number, minBalance: number) {
    return new ApplicationError(
        httpStatus.BAD_REQUEST,
        'Balance below minimum',
        `Balance R$${balance / 100} is lower than the minimum R$${minBalance / 100}.`,
    );
}

export function ResourceNotFound(resource: string, extra = '') {
    return new ApplicationError(httpStatus.NOT_FOUND, 'Not found', `${resource} was not found ${extra}`);
}

export function InsufficientBalanceToBet(balance: number, betAmount: number) {
    return new ApplicationError(
        httpStatus.BAD_REQUEST,
        'Balance below minimum',
        `Bet Amount R$${betAmount / 100} is greater than your balance $${balance / 100}.`,
    );
}

export function GameAlreadyFinished() {
    return new ApplicationError(
        httpStatus.BAD_REQUEST,
        'Cannot Bet in a finished game',
        `Cannot bet in a game that is already finished`,
    );
}
