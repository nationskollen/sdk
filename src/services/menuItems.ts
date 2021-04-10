import { Connection, HttpMethod } from '../connection'
import { MenuItemCollection, MenuItem } from '../typings'

export const MenuService = (connection: Connection) => ({
    all: async (menuId: number): Promise<MenuItemCollection> => {
        const menuItems = await connection.request<MenuItemCollection>(
            HttpMethod.GET,
            `/menus/${menuId}/items`
        )

        return menuItems
    },

    single: async (menuId: number, itemId: number): Promise<MenuItemCollection> => {
        const item = await connection.request<MenuItemCollection>(
            HttpMethod.GET,
            `/menus/${menuId}/items/${itemId}`
        )

        return item
    },

    create: async (menuId: number, data: MenuItem): Promise<MenuItemCollection> => {
        const item = await connection.request<MenuItemCollection>(
            HttpMethod.POST,
            `/menus/${menuId}/items`,
            data
        )

        return item
    },

    // TODO check up on how to upload only "img src"
    /* upload: async (menuId: number, itemId: number, file: Partial<MenuItem>): Promise<void> => { */
    /*     await connection.request<Nation>( */
    /*         HttpMethod.POST, */
    /*         `/menus/${menuId}/items/${itemId}/upload`, */
    /*         file, */
    /*     ) */
    /* }, */

    update: async (
        menuId: number,
        itemId: number,
        data: Partial<MenuItem>
    ): Promise<MenuItemCollection> => {
        const item = await connection.request<MenuItemCollection>(
            HttpMethod.PUT,
            `/menus/${menuId}/items/${itemId}`,
            data
        )

        return item
    },

    delete: async (menuId: number, itemId: number): Promise<void> => {
        await connection.request<MenuItemCollection>(
            HttpMethod.DELETE,
            `/menus/${menuId}/items/${itemId}`
        )
    },
})
