import { User } from '../typings'
import { Context } from './context'
import { useAsync } from 'react-async-hook'
import { useContext, useState, useEffect } from 'react'

export const useApi = () => useContext(Context)

export function useActivityLevel(locationId: number, initialActivityLevel?: number) {
    const { activity } = useApi()
    const [activityLevel, setActivityLevel] = useState(initialActivityLevel ?? 0)

    useEffect(() => {
        activity.subscribe(locationId, setActivityLevel)
        // Cleanup
        return () => activity.unsubscribe(locationId, setActivityLevel)
    })

    return activityLevel
}

export function useAuthentication(email: string, password: string) {
    const api = useApi()
    const [user, setUser] = useState({} as User)
    const [authenticated, setAuthenticated] = useState(false)
    const response = useAsync(api.auth.login, [email, password])

    useEffect(() => {
        if (response.result) {
            setUser(response.result as User)
            setAuthenticated(true)
        } else {
            setUser({} as User)
            setAuthenticated(false)
        }
    }, [response.result])

    return {
        ...response,
        authenticated,
        user,
    }
}
