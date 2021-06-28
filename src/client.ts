import * as Services from './services'
import { Connection } from './connection'

export type ClientWrapper = ReturnType<typeof Client>

export const Client = (baseURL: string, wsURL: string, useWebSockets?: boolean) => {
    const connection = new Connection(baseURL, wsURL, useWebSockets)

    return {
        connection,
        auth: new Services.Auth(connection),
        nations: new Services.Nations(connection),
        locations: new Services.Locations(connection),
        events: new Services.Events(connection),
        menus: new Services.Menus(connection),
        activity: new Services.Activity(connection),
        openingHours: new Services.OpeningHours(connection),
        subscriptions: new Services.Subscriptions(connection),
        individuals: new Services.Individuals(connection),
        contact: new Services.Contact(connection),
        permissions: new Services.Permissions(connection),
    }
}
