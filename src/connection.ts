import axios, { AxiosInstance } from 'axios'
import { BASE_URL, BASE_URL_DEV } from './constants'

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export class Connection {
    private $axios: AxiosInstance

    constructor(development: boolean) {
        this.$axios = axios.create({
            baseURL: development ? BASE_URL_DEV : BASE_URL,
        })
    }

    private addRequestToken(headers: any, token: string) {
        headers['Authentication'] = `Bearer ${token}`
    }

    public async request<T>(method: HttpMethod, endpoint: string, token?: string): Promise<T> {
        const headers = {}

        if (token) {
            this.addRequestToken(headers, token)
        }

        const response = await this.$axios({ url: endpoint, method, headers })
        return response.data
    }
}
