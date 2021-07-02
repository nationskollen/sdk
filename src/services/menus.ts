import { BaseService } from './base'
import { MenuCreateData } from './models'
import { createUploadBody } from '../utils'
import { Menu, PermissionTypes } from '../responses'
import { UploaderFunctionSingle } from '../upload'
import { Connection, HttpMethod } from '../connection'

export type MenuUploads = 'cover'

export class Menus extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public create = async (locationId: number, menuData: MenuCreateData): Promise<Menu> => {
        const menu = await this.$connection.request<Menu>(
            HttpMethod.POST,
            `/locations/${locationId}/menus`,
            menuData,
            [PermissionTypes.Menus]
        )

        return menu
    }

    public update = async (
        locationId: number,
        menuId: number,
        menuData: Partial<MenuCreateData>
    ): Promise<Menu> => {
        const menu = await this.$connection.request<Menu>(
            HttpMethod.POST,
            `/locations/${locationId}/menus/${menuId}`,
            menuData,
            [PermissionTypes.Menus]
        )

        return menu
    }

    public delete = async (locationId: number, menuId: number) => {
        await this.$connection.request<void>(
            HttpMethod.POST,
            `/locations/${locationId}/menus/${menuId}`,
            undefined,
            [PermissionTypes.Menus]
        )
    }

    public upload: UploaderFunctionSingle<Menu, MenuUploads> = async (
        menuId: number,
        field: MenuUploads,
        file: Blob
    ) => {
        const body = createUploadBody({ [field]: file })
        const menu = await this.$connection.upload<Menu>(
            `/menus/${menuId}/upload`,
            body, 
            [PermissionTypes.Menus]
        )

        return menu
    }
}
