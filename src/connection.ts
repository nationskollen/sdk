import axios, { AxiosInstance } from 'axios'
import { BASE_URL, BASE_URL_DEV } from './constants'
import { ResourceOptions } from './typings'
import { WebSocketConnection } from './websockets'
import { Cache } from './cache'

export interface ConnnectionConfigContract {
    development: boolean
    useWebSockets: boolean
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
    private $axios: AxiosInstance
    private $token?: string
    private $ws?: WebSocketConnection
    private $cache: Cache

    constructor({ development, useWebSockets }: ConnnectionConfigContract) {
        this.$axios = axios.create({ baseURL: development ? BASE_URL_DEV : BASE_URL })
        this.$cache = new Cache()

        if (useWebSockets) {
            this.$ws = new WebSocketConnection(development)
        }
    }

    private addRequestToken(headers: any, token: string) {
        headers['Authentication'] = `Bearer ${token}`
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
        if (!options?.invalidate && cacheKey) {
            const cacheData = this.$cache.get(cacheKey)
            if (cacheData) {
                return cacheData as T
            }
        }

        const headers = {}

        // Make sure the user is authenticated,
        // and that the token is not null
        if (isAuthenticated) {
            if (!this.$token) {
                // TODO Maybe import exceptions (or create our own later on)
                throw new Error(
                    'Missing bearer token. Did you forget to run "api.auth.login()" or "api.auth.setToken()"?'
                )
            }

            this.addRequestToken(headers, this.$token)
        }

        const response = await this.$axios({ url: endpoint, method, headers, data })

        // Save the cache when getting a new response
        if (cacheKey) {
            this.$cache.save(cacheKey, response.data)
        } else {
            console.error('key for the cache is undefined')
        }

        return response.data
    }

    public getWebSocket() {
        return this.$ws
    }

    public setToken(token: string) {
        this.$token = token;
    }
}
