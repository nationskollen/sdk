import { Cache } from './cache'
import { ResourceOptions } from './typings'
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
    private $token?: string
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

    private setBearerTokenIfRequired(isAuthenticated: boolean, headers: any) {
        // Make sure the user is authenticated,
        // and that the token is not null
        if (isAuthenticated) {
            if (!this.$token) {
                throw new ApiError(
                    'Missing bearer token. Did you forget to run "api.auth.login()" or "api.auth.setToken()"?'
                )
            }

            headers['Authorization'] = `Bearer ${this.$token}`
        }
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
        isAuthenticated?: boolean,
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

        this.setBearerTokenIfRequired(isAuthenticated ?? false, headers)

        const response = await fetch(this.createUrl(endpoint), {
            method,
            headers,
            body: data ? JSON.stringify(data) : null,
        })

        const parsedResponse = await response.json()
        this.checkForErrors(response.status, parsedResponse)

        // Save the cache when getting a new response
        if (cacheKey) {
            this.$cache.save(cacheKey, parsedResponse)
        } else {
            // Prevent logging of error if cache is disabled for the request
            if (options) {
                console.error('key for the cache is undefined')
            }
        }

        return parsedResponse
    }

    public async upload<T>(endpoint: string, body: FormData): Promise<T> {
        const headers = {}

        this.setBearerTokenIfRequired(true, headers)

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

    public setToken(token: string) {
        this.$token = token
    }
}
