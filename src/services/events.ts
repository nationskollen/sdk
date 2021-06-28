import { BaseService } from './base'
import { EventCreateData } from './models'
import { createUploadBody } from '../utils'
import { Event, Scopes } from '../responses'
import { UploaderFunctionSingle } from '../upload'
import { Connection, HttpMethod } from '../connection'

export type EventUploads = 'cover'

export class Events extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public create = async (oid: number, data: EventCreateData): Promise<Event> => {
        const event = await this.$connection.request<Event>(
            HttpMethod.POST,
            `/nations/${oid}/events`,
            data,
            [Scopes.Admin]
        )
        return event
    }

    public update = async (
        oid: number,
        eventId: number,
        change: Partial<EventCreateData>
    ): Promise<Event> => {
        const event = await this.$connection.request<Event>(
            HttpMethod.PUT,
            `/nations/${oid}/events/${eventId}`,
            change,
            [Scopes.Admin]
        )
        return event
    }

    public delete = async (oid: number, eventId: number) => {
        await this.$connection.request<void>(
            HttpMethod.DELETE,
            `/nations/${oid}/events/${eventId}`,
            undefined,
            [Scopes.Admin]
        )
    }

    public upload: UploaderFunctionSingle<Event, EventUploads> = async (
        eventId: number,
        field: EventUploads,
        file: Blob
    ) => {
        const body = createUploadBody({ [field]: file })
        const event = await this.$connection.upload<Event>(`/events/${eventId}/upload`, body, [
            Scopes.Admin,
        ])

        return event
    }
}
