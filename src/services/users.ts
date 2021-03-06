import { BaseService } from './base'
import { createUploadBody } from '../utils'
import { UsersCreateData } from './models'
import { SingleUser } from '../responses'
import { UploaderFunctionSingle } from '../upload'
import { Connection, HttpMethod } from '../connection'

export type UsersUploads = 'avatar'

export class Users extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public create = async (oid: number, data: UsersCreateData): Promise<SingleUser> => {
        const user = await this.$connection.request<SingleUser>(
            HttpMethod.POST,
            `/nations/${oid}/users`,
            data
        )

        return user
    }

    public update = async (uid: number, change: Partial<UsersCreateData>): Promise<SingleUser> => {
        const user = await this.$connection.request<SingleUser>(
            HttpMethod.PUT,
            `/users/${uid}`,
            change
        )

        return user
    }

    public delete = async (uid: number) => {
        await this.$connection.request<SingleUser>(
            HttpMethod.DELETE,
            `/users/${uid}`,
            undefined,
            true
        )
    }

    public upload: UploaderFunctionSingle<SingleUser, UsersUploads> = async (
        uid: number,
        field: UsersUploads,
        file: Blob
    ) => {
        const body = createUploadBody({ [field]: file })
        const user = await this.$connection.upload<SingleUser>(`/users/${uid}/upload`, body)

        return user
    }
}
