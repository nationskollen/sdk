export enum HttpErrorCodes {
    Ok = 200,
    BadRequest = 400,
    Unauthorized = 401,
    NotFound = 404,
    ValidationError = 422,
    InternalError = 500,
}

export class ApiError extends Error {
    public data?: unknown

    constructor(message: string, data?: unknown) {
        super(message)

        this.data = data
    }
}
