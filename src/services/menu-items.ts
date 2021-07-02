import { BaseService } from './base'
import { createUploadBody } from '../utils'
import { MenuItemCreateData } from './models'
import { MenuItem } from '../responses'
import { UploaderFunctionDouble } from '../upload'
import { Connection, HttpMethod } from '../connection'

export type MenuItemUploads = 'cover'

export class MenuItems extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public create = async (menuId: number, data: MenuItemCreateData): Promise<MenuItem> => {
        const item = await this.$connection.request<MenuItem>(
            HttpMethod.POST,
            `/menus/${menuId}/items`,
            data,
            false,
            false
        )

        return item
    }

    public update = async (
        menuId: number,
        itemId: number,
        data: Partial<MenuItemCreateData>
    ): Promise<MenuItem> => {
        const item = await this.$connection.request<MenuItem>(
            HttpMethod.PUT,
            `/menus/${menuId}/items/${itemId}`,
            data,
            false,
            false
        )

        return item
    }

    public delete = async (menuId: number, itemId: number) => {
        await this.$connection.request<void>(
            HttpMethod.DELETE,
            `/menus/${menuId}/items/${itemId}`,
            undefined,
            true,
            false
        )
    }

    public upload: UploaderFunctionDouble<MenuItem, MenuItemUploads> = async (
        menuId: number,
        itemId: number,
        field: MenuItemUploads,
        file: Blob
    ) => {
        const body = createUploadBody({ [field]: file })
        const menuItem = await this.$connection.upload<MenuItem>(
            `/menus/${menuId}/items/${itemId}/upload`,
            body,
            false
        )

        return menuItem
    }
}
