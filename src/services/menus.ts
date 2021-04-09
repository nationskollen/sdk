import { Connection, HttpMethod } from '../connection'
import { MenuCollection, Menu } from '../typings'

export const MenuService = (connection: Connection) => ({
    all: async (locationId: number): Promise<MenuCollection> => {
        const menus = await connection.request<MenuCollection>(
            HttpMethod.GET,
            `/locations/${locationId}/menus`
        )

        return menus
    },

    single: async (locationId: number, id: number): Promise<Menu> => {
        const menu = await connection.request<Menu>(
            HttpMethod.GET,
            `/locations/${locationId}/menus/${id}`
        )

        return menu
    },
})
