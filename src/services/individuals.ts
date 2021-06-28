import { BaseService } from './base'
import { createUploadBody } from '../utils'
import { IndividualCreateData } from './models'
import { Individual, Scopes } from '../responses'
import { UploaderFunctionSingle } from '../upload'
import { Connection, HttpMethod } from '../connection'

export type IndividualUploads = 'cover'

export class Individuals extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public create = async (
        oid: number,
        data: IndividualCreateData
    ): Promise<Individual> => {
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

    public delete = async (
        oid: number,
        iid: number,
    ): Promise<void> => {
        await this.$connection.request<Individual>(
            HttpMethod.DELETE,
            `/nations/${oid}/individuals/${iid}`,
            undefined,
            [Scopes.Admin]
        )

        return individual
    }

    public upload: UploaderFunctionSingle<Individual, IndividualUploads> = async (
        iid: number,
        field: IndividualUploads,
        file: Blob
    ) => {
        const body = createUploadBody({ [field]: file })
        const individual = await this.$connection.upload<Individual>(
            `/individuals/${iid}/upload`,
            body,
            [Scopes.Admin]
        )

        return individual
    }
}
