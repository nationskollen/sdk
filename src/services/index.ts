import { NationService } from './nations'
import { ActivityService } from './activity'
import { Connection, ConnnectionConfigContract } from '../connection'

export type ServiceWrapper = ReturnType<typeof Service>

export const Service = (config: ConnnectionConfigContract) => {
    // All requests will be handled by the connection instance.
    // This is where request caching etc. will be managed.
    const connection = new Connection(config)

    return {
        activity: ActivityService(connection),
        nations: NationService(connection),
        locations: {},
        menus: {},
        events: {},
    }
}
