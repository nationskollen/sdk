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

    update: async (oid: number, data: Partial<Nation>): Promise<Nation> => {
        const nation = await connection.request<Nation>(HttpMethod.PUT, `/nations/${oid}`, data)

        return nation
    },

    // TODO check up on how to upload only "img src"
    /* upload: async (oid: number, file: Partial<Nation>): Promise<void> => { */
    /*     await connection.request<Nation>( */
    /*         HttpMethod.POST, */
    /*         `/nations/${oid}/upload`, */
    /*         file, */
    /*     ) */
    /* }, */
})
