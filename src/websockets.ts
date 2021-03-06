import { removeCallback } from './utils'
import { WS_RECONNECT_INTERVAL_MS, WS_BACKOFF_MAX, WS_BACKOFF_MODIFIER } from './constants'

export interface ActivityData {
    oid: number
    location_id: number
    activity_level: number
    estimated_people_count: number
}

export enum Subscriptions {
    Connected,
    Activity,
}

export type SubscriptionCallback<T> = (data: T) => void

interface SubscriptionsCallbackMap {
    [Subscriptions.Connected]: SubscriptionCallback<void>
    [Subscriptions.Activity]: SubscriptionCallback<ActivityData>
}

interface Callbacks {
    [Subscriptions.Connected]: Array<SubscriptionsCallbackMap[Subscriptions.Connected]>
    [Subscriptions.Activity]: Array<SubscriptionsCallbackMap[Subscriptions.Activity]>
}

export class WebSocketConnection {
    private $ws?: WebSocket
    private $alive: boolean
    private $wsBaseURL: string
    private $backoffMultiplier = 1
    private $reconnectTimeout?: number
    private $callbacks: Callbacks = {
        [Subscriptions.Connected]: [],
        [Subscriptions.Activity]: [],
    }

    constructor(wsURL: string) {
        this.$wsBaseURL = wsURL
        this.$alive = false
        this.createConnection()
    }

    private createConnection() {
        this.$ws = new WebSocket(this.$wsBaseURL)
        this.$ws.onopen = () => this.onConnect()
        this.$ws.onmessage = (data: any) => this.onMessage(data)
        this.$ws.onclose = () => this.onDisconnect()
    }

    private calculateNextDelay() {
        const newDelay = WS_RECONNECT_INTERVAL_MS * this.$backoffMultiplier

        if (newDelay >= WS_BACKOFF_MAX) {
            return WS_BACKOFF_MAX
        }

        this.$backoffMultiplier *= WS_BACKOFF_MODIFIER

        return newDelay
    }

    private reconnect() {
        // If are in fact connected, there is no need to try and reconnect
        if (this.$alive) {
            if (this.$reconnectTimeout) {
                clearTimeout(this.$reconnectTimeout)
            }

            this.$backoffMultiplier = 1

            return
        }

        if (!this.$reconnectTimeout) {
            this.$reconnectTimeout = window.setTimeout(() => {
                this.reconnect.bind(this)()
            }, this.calculateNextDelay())
        }

        this.createConnection()
    }

    private log(message: string, ...args: any[]) {
        console.info(`[WS] ${message}`, ...args)
    }

    private onConnect() {
        this.log('Connected to websocket server')
        this.$alive = true
    }

    private onMessage(message: any) {
        const parsed = JSON.parse(message.data)

        this.log(`Received:`, parsed)

        if (!parsed || !parsed.hasOwnProperty('type')) {
            this.log(`Could not verify message:`, parsed)
            return
        }

        if (!Object.values(Subscriptions).includes(parsed.type)) {
            this.log('Got unhandled subscription type', parsed.type)
            return
        }

        const event = parsed.type as Subscriptions

        this.$callbacks[event].forEach((cb: any) => cb(parsed.data))
    }

    private onDisconnect() {
        if (this.$alive) {
            this.$alive = false
            this.log(`Disconnected`)
        }

        this.reconnect()
    }

    // TODO: Fix the weird typings on these functions so that we can remove the type casting
    public subscribe<T extends Subscriptions>(event: T, cb: SubscriptionsCallbackMap[T]) {
        ;(this.$callbacks[event] as Array<SubscriptionsCallbackMap[T]>).push(cb)
    }

    public unsubscribe<T extends Subscriptions>(event: T, cb: SubscriptionsCallbackMap[T]) {
        removeCallback(this.$callbacks[event] as Array<SubscriptionsCallbackMap[T]>, cb)
    }

    public isAlive() {
        return this.$alive
    }
}
