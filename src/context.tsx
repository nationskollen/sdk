import Service from './services/index'
import { createContext, useContext } from 'react'

export const Context = createContext({} as Service)
export const useApi = () => useContext(Context)
