import { BaseService } from './base'
import { Connection, HttpMethod } from '../connection'
import { NationCollection, Nation, ResourceOptions } from '../typings'

export class Nations extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public all = async (options?: ResourceOptions): Promise<NationCollection> => {
        const nations = await this.$connection.request<NationCollection>(
            HttpMethod.GET,
            '/nations',
            undefined,
            false,
            options,
            'nationAll'
        )

        return nations
    }

    public single = async (oid: number, options?: ResourceOptions): Promise<Nation> => {
        const nation = await this.$connection.request<Nation>(
            HttpMethod.GET,
            `/nations/${oid}`,
            undefined,
            false,
            options,
            `nationSingle${oid}`
        )

        return nation
    }

    public update = async (oid: number, change: Partial<Nation>): Promise<Nation> => {
        const nation = await this.$connection.request<Nation>(
            HttpMethod.PUT,
            `/nations/${oid}`,
            change,
            true
        )

        return nation
    }
}
