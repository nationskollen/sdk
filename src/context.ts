import { createContext } from 'react'
import { ClientWrapper } from './client'

export type Environment =
    | 'staging'
    | 'development'
    | 'production'

export interface ContextContract {
    api: ClientWrapper
    environment: Environment
}

export const Context = createContext({} as ContextContract)
