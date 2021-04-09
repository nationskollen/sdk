import { NationService } from './nations'
import { BASE_URL, BASE_URL_DEV } from '../constants'

export interface ServiceConfigContract {
    development: boolean
}

export type ServiceWrapper = ReturnType<typeof Service>

export const Service = ({ development }: ServiceConfigContract) => ({
    $config: {
        development,
        baseUrl: development ? BASE_URL_DEV : BASE_URL,
    },
    nations: NationService,
})
