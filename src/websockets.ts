import {
    WS_URL,
    WS_URL_DEV,
    WS_RECONNECT_INTERVAL_MS,
    WS_BACKOFF_MAX,
    WS_BACKOFF_MODIFIER,
} from './constants'

export enum Subscriptions {
    Connected,
    Activity,
}

export type SubscriptionCallback<T> = (data: T) => void

export interface ActivityCallback {
    oid: number
    location_id: number
    activity_level: number
}

interface Callbacks {
    [Subscriptions.Activity]: Array<SubscriptionCallback<ActivityCallback>>
}

export class WebSocketConnection {
    private $ws?: WebSocket
    private $alive: boolean
    private $development: boolean
    private $backoffMultiplier = 1
    private $reconnectTimeout?: number
    private $callbacks: Callbacks = {
        [Subscriptions.Activity]: [],
    }

    constructor(development: boolean) {
        this.$alive = false
        this.$development = development
        this.createConnection()
    }

    private createConnection() {
        this.$ws = new WebSocket(this.$development ? WS_URL_DEV : WS_URL)
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

        switch (parsed.type) {
            case Subscriptions.Connected:
                break
            case Subscriptions.Activity:
                this.$callbacks[Subscriptions.Activity].forEach((cb) => cb(parsed.data))
                break
            default:
                this.log('Got unhandled subscription type')
                break
        }
    }

    private onDisconnect() {
        if (this.$alive) {
            this.$alive = false
            this.log(`Disconnected`)
        }

        this.reconnect()
    }

    public registerActivityCallback(cb: SubscriptionCallback<ActivityCallback>) {
        this.$callbacks[Subscriptions.Activity].push(cb)
    }
}
