import { BaseService } from './base'
import { createUploadBody } from '../uploads'
import { Connection, HttpMethod } from '../connection'
import { EventCollection, Event, ResourceOptions, Scopes } from '../typings'

enum EventUploads {
    Cover = 'cover',
}

enum CacheKeyPrefixes {
    All = 'eventsAll',
    Single = 'eventSingle',
}

export class Events extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public all = async (options?: ResourceOptions): Promise<EventCollection> => {
        const events = await this.$connection.request<EventCollection>(
            HttpMethod.GET,
            '/events',
            undefined,
            options,
            CacheKeyPrefixes.All
        )
        return events
    }

    public allForNation = async (
        oid: number,
        options?: ResourceOptions
    ): Promise<EventCollection> => {
        const events = await this.$connection.request<EventCollection>(
            HttpMethod.GET,
            `/nations/${oid}/events`,
            undefined,
            options,
            this.createCacheKey(CacheKeyPrefixes.All, oid)
        )
        return events
    }

    public single = async (
        oid: number,
        eventId: number,
        options?: ResourceOptions
    ): Promise<Event> => {
        const event = await this.$connection.request<Event>(
            HttpMethod.GET,
            `/nations/${oid}/events/${eventId}`,
            undefined,
            options,
            this.createCacheKey(CacheKeyPrefixes.Single, eventId)
        )
        return event
    }

    public create = async (oid: number, data: Event): Promise<Event> => {
        const event = await this.$connection.request<Event>(
            HttpMethod.POST,
            `/nations/${oid}/events`,
            data,
            this.setScopes([Scopes.Admin])
        )
        return event
    }

    public update = async (
        oid: number,
        eventId: number,
        change: Partial<Event>
    ): Promise<Event> => {
        const event = await this.$connection.request<Event>(
            HttpMethod.PUT,
            `/nations/${oid}/events/${eventId}`,
            change,
            this.setScopes([Scopes.Admin])
        )
        return event
    }

    public delete = async (oid: number, eventId: number): Promise<void> => {
        await this.$connection.request<Event>(
            HttpMethod.DELETE,
            `/nations/${oid}/events/${eventId}`,
            undefined,
            this.setScopes([Scopes.Admin])
        )
    }

    public upload = async (eventId: number, field: EventUploads, file: Blob): Promise<Event> => {
        const body = createUploadBody({ [field]: file })
        const event = await this.$connection.upload<Event>(
            `/events/${eventId}/upload`,
            body,
            this.setScopes([Scopes.Admin]),
            this.createCacheKey(CacheKeyPrefixes.Single, eventId)
        )

        return event
    }
}
