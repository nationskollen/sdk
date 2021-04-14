import { Connection } from '../connection'
import { Scopes, ResourceOptions } from '../typings'

export class BaseService {
    protected $connection: Connection

    constructor(connection: Connection) {
        this.$connection = connection
    }

    protected createCacheKey(prefix: string, uniqueKey: string | number) {
        return `${prefix}${uniqueKey}`
    }

    protected setScopes(scopes: Array<Scopes>, options?: ResourceOptions): ResourceOptions {
        if (!options) {
            return {
                allowedScopes: scopes,
            }
        }

        return {
            ...options,
            allowedScopes: scopes,
        }
    }
}
