import React, { useState } from 'react'
import Service from './services/index'
import { Context } from './context'

export interface ProviderProps {
    development: boolean
    children: JSX.Element[]
}

export interface ProviderState {
    baseUrl: string
}

export const Consumer = Context.Consumer

export const Provider = ({ children, development }: ProviderProps) => {
    const [service] = useState(new Service(development))

    return <Context.Provider value={service}>{children}</Context.Provider>
}
