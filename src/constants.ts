import { Environment } from './context'

export const HOSTNAMES: Record<Environment, string>   = {
    staging: 'nationskollen-staging.engstrand.nu',
    development: '0.0.0.0:3333',
    production: 'nationskollen.se',
}

export const WS_RECONNECT_INTERVAL_MS = 2000
export const WS_BACKOFF_MODIFIER = 1.5
export const WS_BACKOFF_MAX = 1000 * 30

export const CACHE_INVALIDATE_INTERVAL = 1000 * 60
