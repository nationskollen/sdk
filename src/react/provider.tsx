import React, { useState } from 'react'

import { User } from '../typings'
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
    const [user, setUser] = useState<User | null>(null)
    return <Context.Provider value={{ api: client, user, setUser }}>{children}</Context.Provider>
}
