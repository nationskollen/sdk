import { Context } from './context'
import { Service } from './services/index'
import React, { useRef } from 'react'

export interface ProviderProps {
    development: boolean
    children: JSX.Element[]
}

export interface ProviderState {
    baseUrl: string
}

export const Consumer = Context.Consumer

export const Provider = ({ children, development }: ProviderProps) => {
    const service = useRef(Service({ development }))
    return <Context.Provider value={service.current}>{children}</Context.Provider>
}
