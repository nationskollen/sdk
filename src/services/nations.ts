import { BaseService } from './base'
import { NationCreateData } from './models'
import { createUploadBody } from '../utils'
import { Nation, Scopes } from '../responses'
import { Connection, HttpMethod } from '../connection'

export enum NationUploads {
    Icon = 'icon',
    Cover = 'cover',
}

export class Nations extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public update = async (oid: number, change: Partial<NationCreateData>): Promise<Nation> => {
        const nation = await this.$connection.request<Nation>(
            HttpMethod.PUT,
            `/nations/${oid}`,
            change,
            [Scopes.Admin]
        )

        return nation
    }

    public upload = async (oid: number, field: NationUploads, file: Blob): Promise<Nation> => {
        const body = createUploadBody({ [field]: file })
        const nation = await this.$connection.upload<Nation>(`/nations/${oid}/upload`, body, [
            Scopes.Admin,
        ])

        return nation
    }
}
