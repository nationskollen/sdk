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

    create: async (oid: number, data: Location): Promise<Location> => {
        const location = await connection.request<Location>(
            HttpMethod.POST,
                `/nations/${oid}/locations`,
                data,
        )

        return location
    },

    update: async (oid: number, lid: number, change: Partial<Location> ):
        Promise<Location> => {
        const location = await connection.request<Location>(
            HttpMethod.PUT,
                `/nations/${oid}/locations/${lid}`,
                change,
        )
        return location
    },

    delete: async (oid: number, lid: number): Promise<void> => {
        await connection.request<Location>(
            HttpMethod.DELETE,
                `/nations/${oid}/locations/${lid}`
        )
    },
})
