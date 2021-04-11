import axios, { AxiosInstance } from 'axios'
import { BASE_URL, BASE_URL_DEV } from './constants'
import { WebSocketConnection } from './websockets'

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

    constructor({ development, useWebSockets }: ConnnectionConfigContract) {
        this.$axios = axios.create({ baseURL: development ? BASE_URL_DEV : BASE_URL })

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
        isAuthenticated?: boolean
    ): Promise<T> {
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
        return response.data
    }

    public getWebSocket() {
        return this.$ws
    }
}
