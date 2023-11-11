export class ApplicationError extends Error {
    statusCode: number;

    constructor(statusCode: number, name: string, message: string) {
        super(message);

        this.name = name;
        this.message = message;
        this.statusCode = statusCode;
    }
}
