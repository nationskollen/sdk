import { Connection, HttpMethod } from '../connection'
import { NationCollection, Nation } from '../typings'

export const NationService = (connection: Connection) => ({
    all: async (): Promise<NationCollection> => {
        const nations = await connection.request<NationCollection>(HttpMethod.GET, '/nations')
        return nations
    },

    single: async (oid: number): Promise<Nation> => {
        const nation = await connection.request<Nation>(HttpMethod.GET, `/nations/${oid}`)
        return nation
    },
})
