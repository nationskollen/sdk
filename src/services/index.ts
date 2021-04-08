import NationService from './nations'
import { BASE_URL, BASE_URL_DEV } from '../constants'

export default class Service {
    public nations: NationService
    public development: boolean
    public baseUrl: string

    constructor(development = false) {
        this.development = development
        this.nations = new NationService()
        this.baseUrl = this.development ? BASE_URL_DEV : BASE_URL
    }
}
