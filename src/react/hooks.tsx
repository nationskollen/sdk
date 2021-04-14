import { Context } from './context'
import { useContext, useState, useEffect } from 'react'
import { useAsync, useAsyncCallback } from 'react-async-hook'

export const useSDK = () => useContext(Context)
export const useApi = () => useSDK().api
export const useUser = () => useSDK().user

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
    const { api, setUser } = useSDK()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const request = useAsyncCallback(async () => {
        const result = await api.auth.login(email, password)

        // Update the currently logged in user.
        // This will trigger the registered effect callbacks
        // of any components using the 'useUser' hook.
        setUser(result)

        return result
    })

    return {
        ...request,
        email,
        password,
        setEmail,
        setPassword,
    }
}

export function useUpload(fn: (...args: any[]) => Promise<unknown>, params: any[]) {
    const [image, setImage] = useState<Blob | null>(null)
    const request = useAsyncCallback(async () => {
        const concatedParamas = [...params, image]
        const result = await fn(...concatedParamas)

        // Reset image
        setImage(null)

        return result
    })

    const onFileChanged = (e: Event) => {
        if (!e.target) {
            return
        }

        const input = e.target as HTMLInputElement

        if (!input.files || !input.files[0]) {
            return
        }

        setImage(input.files[0])
    }

    return {
        ...request,
        onFileChanged,
    }
}

// TODO: Add parameters for fetching events of specific day
export function useEvents() {
    const api = useApi()
    const request = useAsync(api.events.all, [])

    return {
        ...request,
    }
}
