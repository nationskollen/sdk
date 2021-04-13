import { BaseService } from './base'
import { createUploadBody } from '../uploads'
import { Connection, HttpMethod } from '../connection'
import { MenuItemCollection, MenuItem, ResourceOptions } from '../typings'

export enum MenuItemUploads {
    Cover = 'cover',
}

export class MenuItems extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public all = async (menuId: number, options?: ResourceOptions): Promise<MenuItemCollection> => {
        const menuItems = await this.$connection.request<MenuItemCollection>(
            HttpMethod.GET,
            `/menus/${menuId}/items`,
            undefined,
            false,
            options,
            `menuItemsAll${menuId}`
        )

        return menuItems
    }

    public single = async (
        menuId: number,
        itemId: number,
        options?: ResourceOptions
    ): Promise<MenuItemCollection> => {
        const item = await this.$connection.request<MenuItemCollection>(
            HttpMethod.GET,
            `/menus/${menuId}/items/${itemId}`,
            undefined,
            false,
            options,
            `menuItemsSingle${itemId}`
        )

        return item
    }

    public create = async (menuId: number, data: MenuItem): Promise<MenuItem> => {
        const item = await this.$connection.request<MenuItem>(
            HttpMethod.POST,
            `/menus/${menuId}/items`,
            data,
            true
        )

        return item
    }

    public update = async (
        menuId: number,
        itemId: number,
        data: Partial<MenuItem>
    ): Promise<MenuItem> => {
        const item = await this.$connection.request<MenuItem>(
            HttpMethod.PUT,
            `/menus/${menuId}/items/${itemId}`,
            data,
            true
        )

        return item
    }

    public delete = async (menuId: number, itemId: number): Promise<void> => {
        await this.$connection.request<void>(
            HttpMethod.DELETE,
            `/menus/${menuId}/items/${itemId}`,
            undefined,
            true
        )
    }

    public upload = async (
        menuId: number,
        itemId: number,
        field: MenuItemUploads,
        file: Blob
    ): Promise<MenuItem> => {
        const body = createUploadBody({ [field]: file })
        const menuItem = await this.$connection.upload<MenuItem>(
            `/menus/${menuId}/items/${itemId}/upload`,
            body
        )

        return menuItem
    }
}
