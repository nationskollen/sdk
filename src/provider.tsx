import { SWRConfig } from 'swr'
import { Context } from './context'
import React, { useRef } from 'react'
import { Client, ClientWrapper } from './client'
import { HOSTNAME, HOSTNAME_DEV, CACHE_INVALIDATE_INTERVAL } from './constants'

export interface ProviderConfig {
    development?: boolean
    useWebSockets?: boolean
    customHostName?: string
    useHTTPS?: boolean
}

export interface ProviderProps {
    config: ProviderConfig
    children: JSX.Element
}

export interface ProviderState {
    baseUrl: string
}

export const Consumer = Context.Consumer

export const Provider = ({ children, config }: ProviderProps) => {
    const https = config.useHTTPS ?? !config.development
    const hostname = config.customHostName ?? (config.development ? HOSTNAME_DEV : HOSTNAME)
    const wsURL = `${https ? 'wss' : 'ws'}://${hostname}`
    const baseURL = `${https ? 'https' : 'http'}://${hostname}/api/v1`
    const client = useRef<ClientWrapper>(Client(baseURL, wsURL, config.useWebSockets))

    return (
        <SWRConfig
            refreshInterval={CACHE_INVALIDATE_INTERVAL}
            value={{ fetcher: (url: string) => fetch(`${baseURL}${url}`).then((r) => r.json()) }}
        >
            <Context.Provider value={{ api: client.current }}>{children}</Context.Provider>
        </SWRConfig>
    )
}
