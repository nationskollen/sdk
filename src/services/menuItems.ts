import { BaseService } from './base'
import { Connection, HttpMethod } from '../connection'
import { MenuItemCollection, MenuItem, ResourceOptions } from '../typings'

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
            'menuItemsAll'
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

    public create = async (menuId: number, data: MenuItem): Promise<MenuItemCollection> => {
        const item = await this.$connection.request<MenuItemCollection>(
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
    ): Promise<MenuItemCollection> => {
        const item = await this.$connection.request<MenuItemCollection>(
            HttpMethod.PUT,
            `/menus/${menuId}/items/${itemId}`,
            data,
            true
        )

        return item
    }

    public delete = async (menuId: number, itemId: number): Promise<void> => {
        await this.$connection.request<MenuItemCollection>(
            HttpMethod.DELETE,
            `/menus/${menuId}/items/${itemId}`,
            undefined,
            true
        )
    }
}
