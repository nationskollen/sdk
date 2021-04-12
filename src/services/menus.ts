import { BaseService } from './base'
import { Connection, HttpMethod } from '../connection'
import { MenuCollection, Menu } from '../typings'

export class Menus extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public all = async (locationId: number): Promise<MenuCollection> => {
        const menus = await this.$connection.request<MenuCollection>(
            HttpMethod.GET,
            `/locations/${locationId}/menus`
        )

        return menus
    }

    public single = async (locationId: number, id: number): Promise<Menu> => {
        const menu = await this.$connection.request<Menu>(
            HttpMethod.GET,
            `/locations/${locationId}/menus/${id}`
        )

        return menu
    }

    public create = async (locationId: number, menuData: Menu): Promise<Menu> => {
        const menu = await this.$connection.request<Menu>(
            HttpMethod.POST,
            `/locations/${locationId}/menus`,
            menuData
        )

        return menu
    }

    public update = async (
        locationId: number,
        menuID: number,
        menuData: Partial<Menu>
    ): Promise<Menu> => {
        const menu = await this.$connection.request<Menu>(
            HttpMethod.POST,
            `/locations/${locationId}/menus/${menuID}`,
            menuData
        )

        return menu
    }

    public delete = async (locationId: number, menuID: number): Promise<void> => {
        await this.$connection.request<Menu>(
            HttpMethod.POST,
            `/locations/${locationId}/menus/${menuID}`
        )
    }
}
