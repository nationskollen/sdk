import { ServiceWrapper } from './services/index'
import { createContext, useContext } from 'react'

export const useApi = () => useContext(Context)
export const Context = createContext({} as ServiceWrapper)
