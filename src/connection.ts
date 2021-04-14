import { Cache } from './cache'
import { User, ResourceOptions, Scopes } from './typings'
import { WebSocketConnection } from './websockets'
import { HttpErrorCodes, ApiError } from './errors'
import { BASE_URL, BASE_URL_DEV } from './constants'

export interface ConnnectionConfigContract {
    development: boolean
    useWebSockets: boolean
    customBaseURL?: string
    customWsBaseURL?: string
}

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export interface Data {
    [key: string]: any
}

export class Connection {
    private $baseURL: string
    private $user?: User
    private $ws?: WebSocketConnection
    private $cache: Cache

    constructor({
        development,
        useWebSockets,
        customBaseURL,
        customWsBaseURL,
    }: ConnnectionConfigContract) {
        if (customBaseURL) {
            this.$baseURL = customBaseURL
        } else {
            this.$baseURL = development ? BASE_URL_DEV : BASE_URL
        }

        this.$cache = new Cache()

        if (useWebSockets) {
            this.$ws = new WebSocketConnection(development, customWsBaseURL)
        }
    }

    private setBearerTokenIfRequired(headers: any, scopes?: Array<Scopes>) {
        if (!scopes || scopes.length === 0) {
            return
        }

        if (!this.$user || !this.$user.token) {
            throw new ApiError(
                'Missing bearer token. Did you forget to run "api.auth.login()" or "api.auth.setUser()"?'
            )
        }

        // Only allow the request if we have the correct scope
        if (scopes && !scopes.includes(this.$user.scope)) {
            throw new ApiError(
                'Invalid bearer token scope. You do not have permissions for this request'
            )
        }

        headers['Authorization'] = `Bearer ${this.$user.token}`
    }

    private createUrl(endpoint: string) {
        if (endpoint.substr(0, 1) === '/') {
            return `${this.$baseURL}${endpoint}`
        }

        return `${this.$baseURL}/${endpoint}`
    }

    private checkForErrors(status: HttpErrorCodes, parsedResponse: Record<string, unknown>) {
        if (status === HttpErrorCodes.Ok) {
            return
        }

        let message: string

        switch (status) {
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

        if (parsedResponse.hasOwnProperty('errors')) {
            throw new ApiError(message, parsedResponse.errors)
        } else {
            throw new ApiError(message, parsedResponse)
        }
    }

    public async request<T>(
        method: HttpMethod,
        endpoint: string,
        data?: Data,
        options?: ResourceOptions,
        cacheKey?: string
    ): Promise<T> {
        // Here we check if we have a stored cache of the data before
        // requesting new data
        if (!options?.invalidate && cacheKey && this.$cache.exists(cacheKey)) {
            return this.$cache.get(cacheKey) as T
        }

        const headers = {
            'Content-Type': 'application/json',
        }

        this.setBearerTokenIfRequired(headers, options?.allowedScopes)

        const response = await fetch(this.createUrl(endpoint), {
            method,
            headers,
            body: data ? JSON.stringify(data) : null,
        })

        const parsedResponse = await response.json()
        this.checkForErrors(response.status, parsedResponse)

        if (cacheKey && parsedResponse) {
            this.$cache.save(cacheKey, parsedResponse)
        }

        return parsedResponse
    }

    public async upload<T>(
        endpoint: string,
        body: FormData,
        options?: ResourceOptions,
        cacheKey?: string
    ): Promise<T> {
        const headers = {}

        this.setBearerTokenIfRequired(headers, options?.allowedScopes)

        const response = await fetch(this.createUrl(endpoint), {
            method: HttpMethod.POST,
            headers,
            body,
        })

        const parsedResponse = await response.json()
        this.checkForErrors(response.status, parsedResponse)

        if (cacheKey && parsedResponse) {
            this.$cache.save(cacheKey, parsedResponse)
        }

        return parsedResponse
    }

    public getWebSocket() {
        return this.$ws
    }

    public setUser(user: User) {
        this.$user = user
    }
}
