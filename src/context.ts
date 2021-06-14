import { createContext } from 'react'
import { ClientWrapper } from './client'

export interface ContextContract {
    api: ClientWrapper
}

export const Context = createContext({} as ContextContract)
