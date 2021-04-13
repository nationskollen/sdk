import { Context } from './context'
import { useAsyncCallback } from 'react-async-hook'
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

export function useLogin() {
    const api = useApi()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const response = useAsyncCallback(async () => {
        const result = await api.auth.login(email, password)
        return result
    })

    return {
        ...response,
        email,
        password,
        setEmail,
        setPassword,
    }
}
