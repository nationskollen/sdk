import * as Services from './services'
import { Connection, ConnnectionConfigContract } from './connection'

export type ClientWrapper = ReturnType<typeof Client>

export const Client = (config: ConnnectionConfigContract) => {
    const connection = new Connection(config)

    return {
        auth: new Services.Auth(connection),
        nations: new Services.Nations(connection),
        locations: new Services.Locations(connection),
        menus: new Services.Menus(connection),
        activity: new Services.Activity(connection),
        openingHours: new Services.OpeningHours(connection),
    }
}
