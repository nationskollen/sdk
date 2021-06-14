import { SWRConfig } from 'swr'
import React, { useRef } from 'react'
import { Client, ClientWrapper } from './client'
import { Environment, Context } from './context'
import { HOSTNAMES, CACHE_INVALIDATE_INTERVAL } from './constants'

export interface ProviderConfig {
    environment?: Environment
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
    const selectedEnvironment = config.environment || 'staging'
    const https = config.useHTTPS ?? selectedEnvironment !== 'development'
    const hostname = config.customHostName ?? HOSTNAMES[selectedEnvironment]
    const wsURL = `${https ? 'wss' : 'ws'}://${hostname}`
    const baseURL = `${https ? 'https' : 'http'}://${hostname}/api/v1`
    const client = useRef<ClientWrapper>(Client(baseURL, wsURL, config.useWebSockets))

    return (
        <SWRConfig
            refreshInterval={CACHE_INVALIDATE_INTERVAL}
            value={{ fetcher: (url: string) => fetch(`${baseURL}${url}`).then((r) => r.json()) }}
        >
            <Context.Provider
                value={{
                    api: client.current,
                    environment: selectedEnvironment
                }}
            >
                {children}
            </Context.Provider>
        </SWRConfig>
    )
}
