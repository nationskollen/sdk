import { BaseService } from './base'
import { Location } from '../responses'
import { createUploadBody } from '../utils'
import { UploaderFunctionSingle } from '../upload'
import { HttpErrorCodes, ApiError } from '../errors'
import { Connection, HttpMethod } from '../connection'
import { LocationCreateData, LocationActivityUpdateData } from './models'

export type LocationUploads = 'cover'

export class Locations extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public create = async (oid: number, data: LocationCreateData): Promise<Location> => {
        const location = await this.$connection.request<Location>(
            HttpMethod.POST,
            `/nations/${oid}/locations`,
            data
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
            change
        )

        return location
    }

    public setOpen = async (lid: number, isOpen: boolean): Promise<void> => {
        let endpoint = 'open'

        // If we want to close the location, set the correct endpoint
        if (!isOpen) {
            endpoint = 'close'
        }

        await this.$connection.request<void>(HttpMethod.PUT, `/locations/${lid}/${endpoint}`, undefined, true)
    }

    public setActivity = async (lid: number, data: LocationActivityUpdateData): Promise<void> => {
        if (!data.hasOwnProperty('change') && !data.hasOwnProperty('exact_amount')) {
            throw new ApiError(
                HttpErrorCodes.ValidationError,
                'Updating the activity requires at least one of the properties "change" or "exact_amount"'
            )
        }

        if (data.exact_amount !== undefined && data.exact_amount < 0) {
            throw new ApiError(
                HttpErrorCodes.ValidationError,
                'Setting the current visitor amount of a location requires a positive integer'
            )
        }

        await this.$connection.request<void>(HttpMethod.PUT, `/locations/${lid}/activity`, data, true)
    }

    public delete = async (oid: number, lid: number) => {
        await this.$connection.request<void>(
            HttpMethod.DELETE,
            `/nations/${oid}/locations/${lid}`,
            undefined,
            true
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
            body
        )

        return location
    }
}
