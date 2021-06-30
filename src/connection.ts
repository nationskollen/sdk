import { AuthenticatedUser, Scopes } from './responses'
import { WebSocketConnection } from './websockets'
import { HttpErrorCodes, ApiError } from './errors'

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

type Data = Record<string, any>

export class Connection {
    public baseURL: string
    private $user?: AuthenticatedUser
    private $ws?: WebSocketConnection

    constructor(baseURL: string, wsURL: string, useWebSockets?: boolean) {
        this.baseURL = baseURL

        if (useWebSockets) {
            this.$ws = new WebSocketConnection(wsURL)
        }
    }

    private setBearerTokenIfRequired(headers: any, scopes?: Array<Scopes>) {
        if (!scopes || scopes.length === 0) {
            return
        }

        if (!this.$user || !this.$user.token) {
            throw new ApiError(
                HttpErrorCodes.Unauthorized,
                'Missing bearer token. Did you forget to run "api.auth.login()" or "api.auth.setToken()"?'
            )
        }

        // Only allow the request if we have the correct scope
        if (scopes && !scopes.includes(this.$user.scope)) {
            throw new ApiError(
                HttpErrorCodes.Unauthorized,
                'Invalid bearer token scope. You do not have permissions for this request'
            )
        }

        headers['Authorization'] = `Bearer ${this.$user.token}`
    }

    public createUrl(endpoint: string) {
        if (endpoint.substr(0, 1) === '/') {
            return `${this.baseURL}${endpoint}`
        }

        return `${this.baseURL}/${endpoint}`
    }

    public checkForErrors(status: HttpErrorCodes, parsedResponse?: Record<string, unknown>) {
        if (status === HttpErrorCodes.Ok) {
            return
        }

        let message: string

        switch (status) {
            case HttpErrorCodes.NoContent:
                message = 'No content'
                break
            case HttpErrorCodes.NotFound:
                message = 'Not found'
                break
            case HttpErrorCodes.BadRequest:
                message = 'Bad request'
                break
            case HttpErrorCodes.Unauthorized:
                message = 'Unauthorized'
                break
            case HttpErrorCodes.ValidationError:
                message = 'Validation error'
                break
            case HttpErrorCodes.InternalError:
                message = 'Internal error'
                break
            default:
                message = 'Unknown response code'
                break
        }

        if (parsedResponse?.hasOwnProperty('errors')) {
            throw new ApiError(status, message, parsedResponse.errors)
        } else {
            throw new ApiError(status, message, parsedResponse)
        }
    }

    public async request<T>(
        method: HttpMethod,
        endpoint: string,
        data?: Data,
        allowedScopes?: Array<Scopes>,
        skipParsing?: boolean
    ): Promise<T> {
        const headers = {
            'Content-Type': 'application/json',
        }

        this.setBearerTokenIfRequired(headers, allowedScopes)

        const response = await fetch(this.createUrl(endpoint), {
            method,
            headers,
            body: data ? JSON.stringify(data) : null,
        })

        let parsedResponse: Data | undefined = undefined

        if (!skipParsing) {
            parsedResponse = await response.json()
        }

        this.checkForErrors(response.status, parsedResponse)

        return parsedResponse as T
    }

    public async upload<T>(
        endpoint: string,
        body: FormData,
        allowedScopes: Array<Scopes>
    ): Promise<T> {
        const headers = {}

        this.setBearerTokenIfRequired(headers, allowedScopes)

        const response = await fetch(this.createUrl(endpoint), {
            method: HttpMethod.POST,
            headers,
            body,
        })

        const parsedResponse = await response.json()
        this.checkForErrors(response.status, parsedResponse)

        return parsedResponse
    }

    public getWebSocket() {
        return this.$ws
    }

    public setUser(user?: AuthenticatedUser) {
        this.$user = user
    }

    public getToken() {
        return this.$user?.token
    }
}
