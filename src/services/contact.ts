import { BaseService } from './base'
import { ContactCreateData } from './models'
import { Connection, HttpMethod } from '../connection'
import { ContactInformation, Scopes } from '../responses'

export class Contacts extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public create = async (oid: number, data: ContactCreateData): Promise<ContactInformation> => {
        const information = await this.$connection.request<ContactInformation>(
            HttpMethod.POST,
            `/nations/${oid}/contact`,
            data,
            [Scopes.Admin]
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
            [Scopes.Admin]
        )
        return information
    }

    public delete = async (oid: number): Promise<void> => {
        await this.$connection.request<ContactInformation>(
            HttpMethod.DELETE,
            `/nations/${oid}/contact`,
            undefined,
            [Scopes.Admin]
        )
    }
}