export enum HttpErrorCodes {
    Ok = 200,
    NoContent = 204,
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

        // If you are using react and the 'useAsync', exceptions
        // will not be printed in the console. The only way to see them
        // is to print 'error' or 'error.message' in your components.
        // This is confusing and therefore we make sure to always print
        // the error to console as well.
        console.error(`ApiError: ${message} =>`, data)

        this.data = data
    }
}
