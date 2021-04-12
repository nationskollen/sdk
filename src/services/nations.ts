import { BaseService } from './base'
import { Connection, HttpMethod } from '../connection'
import { NationCollection, Nation } from '../typings'

export class Nations extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public all = async (): Promise<NationCollection> => {
        const nations = await this.$connection.request<NationCollection>(HttpMethod.GET, '/nations')
        return nations
    }

    public single = async (oid: number): Promise<Nation> => {
        const nation = await this.$connection.request<Nation>(HttpMethod.GET, `/nations/${oid}`)
        return nation
    }

    public update = async (oid: number, data: Partial<Nation>): Promise<Nation> => {
        const nation = await this.$connection.request<Nation>(
            HttpMethod.PUT,
            `/nations/${oid}`,
            data
        )
        return nation
    }
}
