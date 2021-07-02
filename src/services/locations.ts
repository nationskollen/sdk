import { BaseService } from './base'
import { createUploadBody } from '../utils'
import { LocationCreateData } from './models'
import { Location } from '../responses'
import { Connection, HttpMethod } from '../connection'
import { UploaderFunctionSingle } from '../upload'

export type LocationUploads = 'cover'

export class Locations extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public create = async (oid: number, data: LocationCreateData): Promise<Location> => {
        const location = await this.$connection.request<Location>(
            HttpMethod.POST,
            `/nations/${oid}/locations`,
            data,
        )
        return location
    }

    public update = async (
        oid: number,
        lid: number,
        change: Partial<LocationCreateData>
    ): Promise<Location> => {
        const location = await this.$connection.request<Location>(
            HttpMethod.PUT,
            `/nations/${oid}/locations/${lid}`,
            change,
        )
        return location
    }

    public delete = async (oid: number, lid: number) => {
        await this.$connection.request<void>(
            HttpMethod.DELETE,
            `/nations/${oid}/locations/${lid}`,
            undefined,
        )
    }

    public upload: UploaderFunctionSingle<Location, LocationUploads> = async (
        locationId: number,
        field: LocationUploads,
        file: Blob
    ) => {
        const body = createUploadBody({ [field]: file })
        const location = await this.$connection.upload<Location>(
            `/locations/${locationId}/upload`,
            body,
        )

        return location
    }
}
