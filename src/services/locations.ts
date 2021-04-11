import { BaseService } from './base'
import { Connection, HttpMethod } from '../connection'
import { LocationCollection, Location } from '../typings'

export class Locations extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public async all(oid: number): Promise<LocationCollection> {
        const locations = await this.$connection.request<LocationCollection>(
            HttpMethod.GET,
            `/nations/${oid}/locations`
        )
        return locations
    }

    public async single(oid: number, id: number): Promise<Location> {
        const location = await this.$connection.request<Location>(
            HttpMethod.GET,
            `/nations/${oid}/locations/${id}`
        )
        return location
    }

    public async create(oid: number, data: Location): Promise<Location> {
        const location = await this.$connection.request<Location>(
            HttpMethod.POST,
            `/nations/${oid}/locations`,
            data
        )
        return location
    }

    public async update(oid: number, lid: number, change: Partial<Location>): Promise<Location> {
        const location = await this.$connection.request<Location>(
            HttpMethod.PUT,
            `/nations/${oid}/locations/${lid}`,
            change
        )
        return location
    }

    public async delete(oid: number, lid: number): Promise<void> {
        await this.$connection.request<Location>(
            HttpMethod.DELETE,
            `/nations/${oid}/locations/${lid}`
        )
    }
}
