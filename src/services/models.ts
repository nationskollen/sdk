import { ContactInformation } from '../responses'

/**
 * Defines the required data needed to create a subscription.
 */
export interface SubscriptionCreateData {
    oid: number
    topic: number
    token: string
}

export type ContactCreateData = Omit<ContactInformation, 'id' | 'nation_id'>
