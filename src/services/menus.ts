import { BaseService } from './base'
import { Connection, HttpMethod } from '../connection'
import { MenuCollection, Menu, ResourceOptions, Scopes } from '../typings'

enum CacheKeyPrefixes {
    All = 'menusAll',
    Single = 'menuSingle',
}

export class Menus extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public all = async (locationId: number, options?: ResourceOptions): Promise<MenuCollection> => {
        const menus = await this.$connection.request<MenuCollection>(
            HttpMethod.GET,
            `/locations/${locationId}/menus`,
            undefined,
            options,
            this.createCacheKey(CacheKeyPrefixes.All, locationId)
        )

        return menus
    }

    public single = async (
        locationId: number,
        menuId: number,
        options?: ResourceOptions
    ): Promise<Menu> => {
        const menu = await this.$connection.request<Menu>(
            HttpMethod.GET,
            `/locations/${locationId}/menus/${menuId}`,
            undefined,
            options,
            this.createCacheKey(CacheKeyPrefixes.Single, menuId)
        )

        return menu
    }

    public create = async (locationId: number, menuData: Menu): Promise<Menu> => {
        const menu = await this.$connection.request<Menu>(
            HttpMethod.POST,
            `/locations/${locationId}/menus`,
            menuData,
            this.setScopes([Scopes.Admin])
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
            this.setScopes([Scopes.Admin])
        )

        return menu
    }

    public delete = async (locationId: number, menuId: number): Promise<void> => {
        await this.$connection.request<void>(
            HttpMethod.POST,
            `/locations/${locationId}/menus/${menuId}`,
            undefined,
            this.setScopes([Scopes.Admin])
        )
    }
}
