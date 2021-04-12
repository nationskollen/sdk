import { BaseService } from './base'
import { Connection, HttpMethod } from '../connection'
import { MenuItemCollection, MenuItem } from '../typings'

export class MenuItems extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public all = async (menuId: number): Promise<MenuItemCollection> => {
        const menuItems = await this.$connection.request<MenuItemCollection>(
            HttpMethod.GET,
            `/menus/${menuId}/items`
        )

        return menuItems
    }

    public single = async (menuId: number, itemId: number): Promise<MenuItemCollection> => {
        const item = await this.$connection.request<MenuItemCollection>(
            HttpMethod.GET,
            `/menus/${menuId}/items/${itemId}`
        )

        return item
    }

    public create = async (menuId: number, data: MenuItem): Promise<MenuItemCollection> => {
        const item = await this.$connection.request<MenuItemCollection>(
            HttpMethod.POST,
            `/menus/${menuId}/items`,
            data
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
            data
        )

        return item
    }

    public delete = async (menuId: number, itemId: number): Promise<void> => {
        await this.$connection.request<MenuItemCollection>(
            HttpMethod.DELETE,
            `/menus/${menuId}/items/${itemId}`
        )
    }
}
