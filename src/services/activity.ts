import { BaseService } from './base'
import { removeCallback } from '../utils'
import { Connection } from '../connection'
import { ActivityLevels } from '../responses'
import { WebSocketConnection, Subscriptions, ActivityData } from '../websockets'

export interface ActivityChangeData {
    level: ActivityLevels
    people: number
}

export type ActivityChangeCallback = (data: ActivityChangeData) => void

interface Callbacks {
    [key: number]: Array<ActivityChangeCallback>
}

export class Activity extends BaseService {
    private $ws?: WebSocketConnection
    private $hasWebSocketCallback = false
    private $callbacks: Callbacks = {}

    constructor(connection: Connection) {
        super(connection)

        this.$ws = connection.getWebSocket()
    }

    private handleActivityChange({
        location_id,
        activity_level,
        estimated_people_count,
    }: ActivityData) {
        if (!this.$callbacks.hasOwnProperty(location_id)) {
            return
        }

        this.$callbacks[location_id].forEach((cb) =>
            cb({
                level: activity_level,
                people: estimated_people_count,
            })
        )
    }

    private subscribeToActivityChange() {
        if (!this.$ws || this.$hasWebSocketCallback) {
            return
        }

        this.$ws.subscribe(Subscriptions.Activity, (message) =>
            this.handleActivityChange.bind(this)(message)
        )
        this.$hasWebSocketCallback = true
    }

    public subscribe(locationId: number, cb: ActivityChangeCallback) {
        if (!this.$ws) {
            return
        }

        // Make sure that we have registered an internal callback for activity changes
        this.subscribeToActivityChange()

        // Add the callback to our local callbacks
        if (this.$callbacks.hasOwnProperty(locationId)) {
            this.$callbacks[locationId].push(cb)
        } else {
            this.$callbacks[locationId] = [cb]
        }
    }

    public unsubscribe(locationId: number, cb: ActivityChangeCallback) {
        if (!this.$ws || !this.$callbacks.hasOwnProperty(locationId)) {
            return
        }

        removeCallback(this.$callbacks[locationId], cb)
        // TODO: Remove internal activity change callback if no registered callbacks exists?
    }

    public getCallbacks() {
        return this.$callbacks
    }
}
