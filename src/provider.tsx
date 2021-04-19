import { SWRConfig } from 'swr'
import { User } from './responses'
import { Context } from './context'
import React, { useState, useRef } from 'react'
import { Client, ClientWrapper } from './client'
import { HOSTNAME, HOSTNAME_DEV } from './constants'

export interface ProviderConfig {
    development?: boolean
    useWebSockets?: boolean
    customHostName?: string
    useHTTPS?: boolean
}

export interface ProviderProps {
    config: ProviderConfig
    children: JSX.Element[]
}

export interface ProviderState {
    baseUrl: string
}

export const Consumer = Context.Consumer

export const Provider = ({ children, config }: ProviderProps) => {
    const [user, setUser] = useState<User | null>(null)
    const https = config.useHTTPS ?? !config.development
    const hostname = config.customHostName ?? (config.development ? HOSTNAME_DEV : HOSTNAME)
    const wsURL = `${https ? 'wss' : 'ws'}://${hostname}`
    const baseURL = `${https ? 'https' : 'http'}://${hostname}/api/v1`
    const client = useRef<ClientWrapper>(Client(baseURL, wsURL, config.useWebSockets))

    return (
        <SWRConfig
            value={{ fetcher: (url: string) => fetch(`${baseURL}${url}`).then((r) => r.json()) }}
        >
            <Context.Provider value={{ api: client.current, user, setUser }}>
                {children}
            </Context.Provider>
        </SWRConfig>
    )
}
