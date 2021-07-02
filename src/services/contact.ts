import { BaseService } from './base'
import { ContactCreateData } from './models'
import { Connection, HttpMethod } from '../connection'
import { ContactInformation } from '../responses'

export class Contact extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public create = async (oid: number, data: ContactCreateData): Promise<ContactInformation> => {
        const information = await this.$connection.request<ContactInformation>(
            HttpMethod.POST,
            `/nations/${oid}/contact`,
            data,
            false,
            false
        )

        return information
    }

    public update = async (
        oid: number,
        change: Partial<ContactCreateData>
    ): Promise<ContactInformation> => {
        const information = await this.$connection.request<ContactInformation>(
            HttpMethod.PUT,
            `/nations/${oid}/contact`,
            change,
            false,
            false
        )

        return information
    }

    public delete = async (oid: number) => {
        await this.$connection.request<void>(
            HttpMethod.DELETE,
            `/nations/${oid}/contact`,
            undefined,
            true,
            false
        )
    }
}
