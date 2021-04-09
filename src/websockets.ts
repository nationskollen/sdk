import WebSocket from 'isomorphic-ws'

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

    constructor(baseURL: string) {
        this.$ws = new WebSocket(baseURL)
        this.$alive = false

        this.$ws.onopen = () => this.onConnect()
        this.$ws.onmessage = (data: any) => this.onMessage(data)
        this.$ws.onclose = () => this.onDisconnect()
    }

    private log(message: string) {
        console.info(`[WS] ${message}`)
    }

    private onConnect() {
        this.log('Connected to websocket server')
        this.$alive = true
    }

    private onMessage(data: any) {
        const parsed = JSON.parse(data)
        this.log(`Received: ${parsed}`)

        if (!parsed || !parsed.hasOwnProperty('type')) {
            this.log(`Could not verify message: ${parsed}`)
            return
        }

        switch (parsed.type) {
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
