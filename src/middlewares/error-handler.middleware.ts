import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { ApplicationError } from '../errors';

export function ErrorHandler(
    err: ApplicationError | Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
) {
    // If not a ApplicationError, send 500.
    if (!(err instanceof ApplicationError)) {
        console.log('Unhandled error: ', err.message);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
    }

    // Case debug is active, print on console.
    if (process.env.DEBUG) console.log(`[${err.name}] (${err.statusCode}): ${err.message}`);

    return res.status(err.statusCode).send({
        message: err.message,
    });
}
