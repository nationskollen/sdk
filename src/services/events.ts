import { BaseService } from './base'
import { createUploadBody } from '../uploads'
import { Connection, HttpMethod } from '../connection'
import { Event, Scopes } from '../typings'

enum EventUploads {
    Cover = 'cover',
}

export class Events extends BaseService {
    constructor(connection: Connection) {
        super(connection)
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
        )

        return event
    }
}
