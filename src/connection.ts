import axios, { AxiosInstance } from 'axios'
import { BASE_URL, BASE_URL_DEV } from './constants'
import { WebSocketConnection, SubscriptionCallback, ActivityCallback } from './websockets'

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
    private $token: string | null
    private $ws: WebSocketConnection | null = null


    constructor({ development, useWebSockets }: ConnnectionConfigContract) {
        const baseURL = development ? BASE_URL_DEV : BASE_URL

        this.$axios = axios.create({ baseURL })

        if (useWebSockets) {
            this.$ws = new WebSocketConnection(development)
        }

        this.$token = null
    }

    private addRequestToken(headers: any, token: string) {
        headers['Authentication'] = `Bearer ${token}`
    }

    public async request<T>(method: HttpMethod, endpoint: string, data?: Data, isAuthenticated?: boolean): Promise<T> {
        const headers = {}

        // Make sure the user is authenticated,
        // and that the token is not null
        if (isAuthenticated) {
            if (this.$token) {
                this.addRequestToken(headers, this.$token)
            } else {
                // TODO Maybe import exceptions (or create our own later on)
                throw new Error("user token is null")
            }
        }

        const response = await this.$axios({ url: endpoint, method, headers, data })
        return response.data
    }

    public subscribeToActivityCallback(cb: SubscriptionCallback<ActivityCallback>) {
        if (!this.$ws) {
            return
        }

        this.$ws.registerActivityCallback(cb)
    }
}
