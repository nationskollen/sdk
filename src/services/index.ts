import { NationService } from './nations'
import { Connection } from '../connection'
import { ActivityService } from './activity'

export type ServiceWrapper = ReturnType<typeof Service>

export const Service = (connection: Connection) => {
    return {
        activity: ActivityService(connection),
        nations: NationService(connection),
        locations: {},
        menus: {},
        events: {},
    }
}
