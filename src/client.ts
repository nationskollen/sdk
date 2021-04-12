import * as Services from './services'
import { Connection, ConnnectionConfigContract } from './connection'

export type ClientWrapper = ReturnType<typeof Client>

export const Client = (config: ConnnectionConfigContract) => {
    const connection = new Connection(config)

    return {
        activity: new Services.Activity(connection),
        nations: new Services.Nations(connection),
        locations: new Services.Locations(connection),
        menus: new Services.Menus(connection),
        auth: new Services.Auth(connection),
    }
}
