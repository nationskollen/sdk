import { User } from './responses'
import { createContext } from 'react'
import { ClientWrapper } from './client'

export interface ContextContract {
    api: ClientWrapper
    user: User | null
    setUser: React.Dispatch<React.SetStateAction<User | null>>
}

export const Context = createContext({} as ContextContract)
