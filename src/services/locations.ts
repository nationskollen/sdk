import { BaseService } from './base'
import { createUploadBody } from '../uploads'
import { Connection, HttpMethod } from '../connection'
import { Location, Scopes } from '../typings'

enum LocationUploads {
    Cover = 'cover',
}

export class Locations extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public create = async (oid: number, data: Location): Promise<Location> => {
        const location = await this.$connection.request<Location>(
            HttpMethod.POST,
            `/nations/${oid}/locations`,
            data,
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
            this.setScopes([Scopes.Admin])
        )
        return location
    }

    public delete = async (oid: number, lid: number): Promise<void> => {
        await this.$connection.request<Location>(
            HttpMethod.DELETE,
            `/nations/${oid}/locations/${lid}`,
            undefined,
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
            this.setScopes([Scopes.Admin]),
        )

        return location
    }
}
