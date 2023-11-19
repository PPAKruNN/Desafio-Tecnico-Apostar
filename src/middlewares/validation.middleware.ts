import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
import { InvalidDataError } from '../errors';

export function ValidateBody<T>(schema: ObjectSchema<T>): ValidationMiddleware {
    return Validate(schema, 'body');
}

export function ValidateParams<T>(schema: ObjectSchema<T>): ValidationMiddleware {
    return Validate(schema, 'params');
}

function Validate(schema: ObjectSchema, type: 'body' | 'params') {
    return (req: Request, _res: Response, next: NextFunction) => {
        const { error } = schema.validate(req[type], { abortEarly: false });

        if (!error) {
            next();
        } else {
            let errorMessage = '';
            error.details.forEach((d) => (errorMessage += d.message + ' '));
            throw InvalidDataError(errorMessage);
        }
    };
}

type ValidationMiddleware = (req: Request, res: Response, next: NextFunction) => void;
