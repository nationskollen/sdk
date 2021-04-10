import { Connection } from '../connection'
import { SubscriptionCallback, ActivityCallback } from '../websockets'

export const ActivityService = (connection: Connection) => ({
    subscribe: (cb: SubscriptionCallback<ActivityCallback>): void => {
        connection.subscribeToActivityCallback(cb)
    },
})
