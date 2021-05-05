import { BaseService } from './base'
import { createUploadBody } from '../utils'
import { Menu, Scopes } from '../responses'
import { Connection, HttpMethod } from '../connection'

export enum MenuUploads {
    Cover = 'cover',
}

export class Menus extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public create = async (locationId: number, menuData: Menu): Promise<Menu> => {
        const menu = await this.$connection.request<Menu>(
            HttpMethod.POST,
            `/locations/${locationId}/menus`,
            menuData,
            [Scopes.Admin]
        )

        return menu
    }

    public update = async (
        locationId: number,
        menuId: number,
        menuData: Partial<Menu>
    ): Promise<Menu> => {
        const menu = await this.$connection.request<Menu>(
            HttpMethod.POST,
            `/locations/${locationId}/menus/${menuId}`,
            menuData,
            [Scopes.Admin]
        )

        return menu
    }

    public delete = async (locationId: number, menuId: number): Promise<void> => {
        await this.$connection.request<void>(
            HttpMethod.POST,
            `/locations/${locationId}/menus/${menuId}`,
            undefined,
            [Scopes.Admin]
        )
    }

    public upload = async (menuId: number, field: MenuUploads, file: Blob): Promise<Menu> => {
        const body = createUploadBody({ [field]: file })
        const menu = await this.$connection.upload<Menu>(`/menus/${menuId}/upload`, body, [
            Scopes.Admin,
        ])

        return menu
    }
}
