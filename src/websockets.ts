import { WS_URL, WS_URL_DEV } from './constants'

export enum Subscriptions {
    Connected,
    Activity,
}

export type SubscriptionCallback<T> = (data: T) => void

export interface ActivityCallback {
    oid: number
    location: number
    activity: number
}

interface Callbacks {
    [Subscriptions.Activity]: Array<SubscriptionCallback<ActivityCallback>>
}

export class WebSocketConnection {
    private $ws: WebSocket
    //@ts-ignore
    private $alive: boolean
    private $callbacks: Callbacks = {
        [Subscriptions.Activity]: [],
    }

    constructor(development: boolean) {
        this.$ws = new WebSocket(development ? WS_URL_DEV : WS_URL)
        this.$alive = false

        this.$ws.onopen = () => this.onConnect()
        this.$ws.onmessage = (data: any) => this.onMessage(data)
        this.$ws.onclose = () => this.onDisconnect()
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
        this.$alive = false
        this.log(`Disconnected`)
    }

    public registerActivityCallback(cb: SubscriptionCallback<ActivityCallback>) {
        this.$callbacks[Subscriptions.Activity].push(cb)
    }
}
