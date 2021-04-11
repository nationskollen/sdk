import React, { useRef } from 'react'

import { Context } from './context'
import { Connection } from '../connection'
import { Service } from '../services/index'

export interface ProviderProps {
    connection: Connection
    children: JSX.Element[]
}

export interface ProviderState {
    baseUrl: string
}

export const Consumer = Context.Consumer

export const Provider = ({ children, connection }: ProviderProps) => {
    const service = useRef(Service(connection))
    return <Context.Provider value={service.current}>{children}</Context.Provider>
}
