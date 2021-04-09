import { Connection, HttpMethod } from '../connection'
import { LocationCollection, Location } from '../typings'

export const LocationService = (connection: Connection) => ({
    all: async (oid: number): Promise<LocationCollection> => {
        const locations = await connection.request<LocationCollection>(
            HttpMethod.GET,
            `/nations/${oid}/locations`
        )
        return locations
    },

    single: async (oid: number, id: number): Promise<Location> => {
        const location = await connection.request<Location>(
            HttpMethod.GET,
            `/nations/${oid}/locations/${id}`
        )
        return location
    },
})
