import { NationService } from './nations'
import { Connection } from '../connection'

export interface ServiceConfigContract {
    development: boolean
}

export type ServiceWrapper = ReturnType<typeof Service>

export const Service = ({ development }: ServiceConfigContract) => {
    // All requests will be handled by the connection instance.
    // This is where request caching etc. will be managed.
    const connection = new Connection(development)

    return {
        nations: NationService(connection),
        locations: {},
        menus: {},
        events: {},
    }
}
