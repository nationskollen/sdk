import { BaseService } from './base'
import { PermissionCreateData } from './models'
import { Permission, PermissionTypes } from '../responses'
import { Connection, HttpMethod } from '../connection'

export class Permissions extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public create = async (permissionData: PermissionCreateData): Promise<Permission> => {
        const permission = await this.$connection.request<Permission>(
            HttpMethod.POST,
            `/permissions`,
            permissionData,
            [PermissionTypes.UserPermissions]
        )

        return permission
    }

    public delete = async (permissionData: PermissionCreateData): Promise<void> => {
        await this.$connection.request<Permission>(
            HttpMethod.DELETE,
            `/permissions`,
            permissionData,
            [PermissionTypes.UserPermissions]
        )
    }
}
