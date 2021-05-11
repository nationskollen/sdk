import { BaseService } from './base'
import { SubscriptionCreateData } from './models'
import { Connection, HttpMethod } from '../connection'
import { Subscription as SubscriptionResponse } from '../responses'

export class Subscriptions extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public create = async (data: SubscriptionCreateData): Promise<SubscriptionResponse> => {
        const subscription = await this.$connection.request<SubscriptionResponse>(
            HttpMethod.POST,
            `/subscriptions`,
            data
        )
        return subscription
    }

    public delete = async (uuid: string): Promise<void> => {
        await this.$connection.request<SubscriptionResponse>(
            HttpMethod.DELETE,
            `/subscriptions/${uuid}`,
            undefined
        )
    }
}
