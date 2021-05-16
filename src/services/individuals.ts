import { BaseService } from './base'
import { createUploadBody } from '../utils'
import { IndividualCreateData } from './models'
import { Individual, Scopes } from '../responses'
import { Connection, HttpMethod } from '../connection'

export enum IndividualUploads {
    Cover = 'cover',
}

export class Individuals extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public create = async (oid: number, data: IndividualCreateData): Promise<Individual> => {
        const individual = await this.$connection.request<Individual>(
            HttpMethod.POST,
            `/nations/${oid}/individuals`,
            data,
            [Scopes.Admin]
        )
        return individual
    }

    public update = async (
        oid: number,
        iid: number,
        change: Partial<IndividualCreateData>
    ): Promise<Individual> => {
        const individual = await this.$connection.request<Individual>(
            HttpMethod.PUT,
            `/nations/${oid}/individuals/${iid}`,
            change,
            [Scopes.Admin]
        )

        return individual
    }

    public upload = async (
        iid: number,
        field: IndividualUploads,
        file: Blob
    ): Promise<Individual> => {
        const body = createUploadBody({ [field]: file })
        const individual = await this.$connection.upload<Individual>(
            `/individuals/${iid}/upload`,
            body,
            [Scopes.Admin]
        )

        return individual
    }
}
