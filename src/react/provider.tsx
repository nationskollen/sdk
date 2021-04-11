import React from 'react'

import { Context } from './context'
import { ClientWrapper } from '../client'

export interface ProviderProps {
    client: ClientWrapper
    children: JSX.Element[]
}

export interface ProviderState {
    baseUrl: string
}

export const Consumer = Context.Consumer

export const Provider = ({ children, client }: ProviderProps) => {
    return <Context.Provider value={client}>{children}</Context.Provider>
}
