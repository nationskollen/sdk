import axios from 'axios'
import { BASE_URL, BASE_URL_DEV } from './constants'

export class Connection {
    private $baseURL: string

    constructor(development: boolean) {
        this.$baseURL = development ? BASE_URL_DEV : BASE_URL
    }

    private addRequestToken(headers: any, token: string) {
        headers['Authentication'] = `Bearer ${token}`
    }

    public async get<T>(endpoint: string, token?: string): Promise<T> {
        const headers = {}

        if (token) {
            this.addRequestToken(headers, token)
        }

        const response = await axios.get(endpoint, { headers, baseURL: this.$baseURL })
        return response.data
    }
}
