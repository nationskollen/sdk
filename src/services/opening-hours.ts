import { BaseService } from './base'
import { Connection, HttpMethod } from '../connection'
import { OpeningHourCollection, OpeningHour, ResourceOptions, Scopes } from '../typings'

enum CacheKeyPrefixes {
    All = 'openingHoursAll',
    Single = 'openingHourSingle',
}

export class OpeningHours extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public all = async (
        locationId: number,
        options?: ResourceOptions
    ): Promise<OpeningHourCollection> => {
        const hours = await this.$connection.request<OpeningHourCollection>(
            HttpMethod.GET,
            `/locations/${locationId}/hours`,
            undefined,
            options,
            this.createCacheKey(CacheKeyPrefixes.All, locationId)
        )

        return hours
    }

    public single = async (
        locationId: number,
        hourId: number,
        options?: ResourceOptions
    ): Promise<OpeningHour> => {
        const hour = await this.$connection.request<OpeningHour>(
            HttpMethod.GET,
            `/locations/${locationId}/hours/${hourId}`,
            undefined,
            options,
            this.createCacheKey(CacheKeyPrefixes.Single, hourId)
        )

        return hour
    }

    public create = async (locationId: number, data: OpeningHour): Promise<OpeningHour> => {
        const hour = await this.$connection.request<OpeningHour>(
            HttpMethod.POST,
            `/locations/${locationId}/hours`,
            data,
            this.setScopes([Scopes.Admin])
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
            this.setScopes([Scopes.Admin])
        )

        return hour
    }

    public delete = async (locationId: number, hourId: number): Promise<void> => {
        await this.$connection.request<void>(
            HttpMethod.DELETE,
            `/locations/${locationId}/hours/${hourId}`,
            undefined,
            this.setScopes([Scopes.Admin])
        )
    }
}
