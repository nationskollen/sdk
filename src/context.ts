import { createContext } from 'react'
import { ClientWrapper } from './client'

export type Environment = 'testing' | 'staging' | 'production'

export interface ContextContract {
    api: ClientWrapper
    environment: Environment
    https: boolean
    hostname: string
    baseURL: string
}

export const Context = createContext({} as ContextContract)
