import { Context } from './context'
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
