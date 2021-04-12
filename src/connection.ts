import { Cache } from './cache'
import { ResourceOptions } from './typings'
import { WebSocketConnection } from './websockets'
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

    constructor({ development, useWebSockets, customBaseURL, customWsBaseURL }: ConnnectionConfigContract) {
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

    private addRequestToken(headers: any, token: string) {
        headers['Authentication'] = `Bearer ${token}`
    }

    private createUrl(endpoint: string) {
        if (endpoint.substr(0, 1) === '/')  {
            return `${this.$baseURL}${endpoint}`
        }

        return `${this.$baseURL}/${endpoint}`
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

        // Make sure the user is authenticated,
        // and that the token is not null
        if (isAuthenticated) {
            if (!this.$token) {
                throw new Error(
                    'Missing bearer token. Did you forget to run "api.auth.login()" or "api.auth.setToken()"?'
                )
            }

            this.addRequestToken(headers, this.$token)
        }

        const response = await fetch(this.createUrl(endpoint), {
            method,
            headers,
            body: data ? JSON.stringify(data) : null,
        })

        const parsedResponse = await response.json()

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

    public getWebSocket() {
        return this.$ws
    }

    public setToken(token: string) {
        this.$token = token
    }
}
