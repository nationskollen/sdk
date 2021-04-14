import { BaseService } from './base'
import { createUploadBody } from '../uploads'
import { Connection, HttpMethod } from '../connection'
import { LocationCollection, Location, ResourceOptions, Scopes } from '../typings'

export enum LocationUploads {
    Cover = 'cover',
}

export class Locations extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public all = async (oid: number, options?: ResourceOptions): Promise<LocationCollection> => {
        const locations = await this.$connection.request<LocationCollection>(
            HttpMethod.GET,
            `/nations/${oid}/locations`,
            undefined,
            false,
            this.setScopes([], options),
            `locationsAll${oid}`
        )
        return locations
    }

    public single = async (
        oid: number,
        id: number,
        options?: ResourceOptions
    ): Promise<Location> => {
        const location = await this.$connection.request<Location>(
            HttpMethod.GET,
            `/nations/${oid}/locations/${id}`,
            undefined,
            false,
            this.setScopes([], options),
            `locationSingle${id}`
        )
        return location
    }

    public create = async (oid: number, data: Location): Promise<Location> => {
        const location = await this.$connection.request<Location>(
            HttpMethod.POST,
            `/nations/${oid}/locations`,
            data,
            true,
            this.setScopes([Scopes.Admin])
        )
        return location
    }

    public update = async (
        oid: number,
        lid: number,
        change: Partial<Location>
    ): Promise<Location> => {
        const location = await this.$connection.request<Location>(
            HttpMethod.PUT,
            `/nations/${oid}/locations/${lid}`,
            change,
            true,
            this.setScopes([Scopes.Admin])
        )
        return location
    }

    public delete = async (oid: number, lid: number): Promise<void> => {
        await this.$connection.request<Location>(
            HttpMethod.DELETE,
            `/nations/${oid}/locations/${lid}`,
            undefined,
            true,
            this.setScopes([Scopes.Admin])
        )
    }

    public upload = async (
        locationId: number,
        field: LocationUploads,
        file: Blob
    ): Promise<Location> => {
        const body = createUploadBody({ [field]: file })
        const location = await this.$connection.upload<Location>(
            `/locations/${locationId}/upload`,
            body,
            this.setScopes([Scopes.Admin])
        )

        return location
    }
}
