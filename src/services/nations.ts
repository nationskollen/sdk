import { BaseService } from './base'
import { NationCreateData } from './models'
import { createUploadBody } from '../utils'
import { Nation } from '../responses'
import { UploaderFunctionSingle } from '../upload'
import { Connection, HttpMethod } from '../connection'

export type NationUploads = 'icon' | 'cover'

export class Nations extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public update = async (oid: number, change: Partial<NationCreateData>): Promise<Nation> => {
        const nation = await this.$connection.request<Nation>(
            HttpMethod.PUT,
            `/nations/${oid}`,
            change
        )

        return nation
    }

    public upload: UploaderFunctionSingle<Nation, NationUploads> = async (
        oid: number,
        field: NationUploads,
        file: Blob
    ) => {
        const body = createUploadBody({ [field]: file })
        const nation = await this.$connection.upload<Nation>(`/nations/${oid}/upload`, body)

        return nation
    }
}
