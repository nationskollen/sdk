import { BaseService } from './base'
import { Connection, HttpMethod } from '../connection'
import { OpeningHour, Scopes } from '../typings'

export class OpeningHours extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public create = async (locationId: number, data: OpeningHour): Promise<OpeningHour> => {
        const hour = await this.$connection.request<OpeningHour>(
            HttpMethod.POST,
            `/locations/${locationId}/hours`,
            data,
            [Scopes.Admin],
        )

        return hour
    }

    public update = async (
        locationId: number,
        hourId: number,
        data: Partial<OpeningHour>
    ): Promise<OpeningHour> => {
        const hour = await this.$connection.request<OpeningHour>(
            HttpMethod.PUT,
            `/locations/${locationId}/hours/${hourId}`,
            data,
            [Scopes.Admin],
        )

        return hour
    }

    public delete = async (locationId: number, hourId: number): Promise<void> => {
        await this.$connection.request<void>(
            HttpMethod.DELETE,
            `/locations/${locationId}/hours/${hourId}`,
            undefined,
            [Scopes.Admin],
        )
    }
}
