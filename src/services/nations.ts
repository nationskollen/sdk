import { NationCollection } from '../typings'
import { Connection } from '../connection'

export const NationService = (connection: Connection) => ({
    all: async (): Promise<NationCollection> => {
        const nations = await connection.get<NationCollection>('/nations')
        return nations
    },
})
