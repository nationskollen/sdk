import { BaseService } from './base'
import { Connection, HttpMethod } from '../connection'
import { MenuCollection, Menu } from '../typings'

export class Menus extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public async all(locationId: number): Promise<MenuCollection> {
        const menus = await this.$connection.request<MenuCollection>(
            HttpMethod.GET,
            `/locations/${locationId}/menus`
        )

        return menus
    }

    public async single(locationId: number, id: number): Promise<Menu> {
        const menu = await this.$connection.request<Menu>(
            HttpMethod.GET,
            `/locations/${locationId}/menus/${id}`
        )

        return menu
    }

    public async create(locationId: number, menuData: Menu): Promise<Menu> {
        const menu = await this.$connection.request<Menu>(
            HttpMethod.POST,
            `/locations/${locationId}/menus`,
            menuData
        )

        return menu
    }

    public async update(
        locationId: number,
        menuID: number,
        menuData: Partial<Menu>
    ): Promise<Menu> {
        const menu = await this.$connection.request<Menu>(
            HttpMethod.POST,
            `/locations/${locationId}/menus/${menuID}`,
            menuData
        )

        return menu
    }

    public async delete(locationId: number, menuID: number): Promise<void> {
        await this.$connection.request<Menu>(
            HttpMethod.POST,
            `/locations/${locationId}/menus/${menuID}`
        )
    }
}
