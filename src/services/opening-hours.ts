import { BaseService } from './base'
import { OpeningHourCreateData } from './models'
import { OpeningHour } from '../responses'
import { Connection, HttpMethod } from '../connection'

export class OpeningHours extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public create = async (
        locationId: number,
        data: OpeningHourCreateData
    ): Promise<OpeningHour> => {
        const hour = await this.$connection.request<OpeningHour>(
            HttpMethod.POST,
            `/locations/${locationId}/hours`,
            data
        )

        return hour
    }

    public update = async (
        locationId: number,
        hourId: number,
        data: Partial<OpeningHourCreateData>
    ): Promise<OpeningHour> => {
        const hour = await this.$connection.request<OpeningHour>(
            HttpMethod.PUT,
            `/locations/${locationId}/hours/${hourId}`,
            data
        )

        return hour
    }

    public delete = async (locationId: number, hourId: number) => {
        await this.$connection.request<void>(
            HttpMethod.DELETE,
            `/locations/${locationId}/hours/${hourId}`,
            undefined,
            true
        )
    }
}
