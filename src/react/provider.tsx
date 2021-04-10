import { Context } from './context'
import { Service } from '../services/index'
import React, { useRef } from 'react'

export interface ProviderProps {
    development: boolean
    useWebSockets: boolean
    children: JSX.Element[]
}

export interface ProviderState {
    baseUrl: string
}

export const Consumer = Context.Consumer

export const Provider = ({ children, development, useWebSockets }: ProviderProps) => {
    const service = useRef(Service({ development, useWebSockets }))
    return <Context.Provider value={service.current}>{children}</Context.Provider>
}
