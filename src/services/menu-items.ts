import { BaseService } from './base'
import { createUploadBody } from '../uploads'
import { Connection, HttpMethod } from '../connection'
import { MenuItemCollection, MenuItem, ResourceOptions, Scopes } from '../typings'

enum MenuItemUploads {
    Cover = 'cover',
}

enum CacheKeyPrefixes {
    All = 'menuItemsAll',
    Single = 'menuItemsSingle',
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
            options,
            this.createCacheKey(CacheKeyPrefixes.All, menuId)
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
            options,
            this.createCacheKey(CacheKeyPrefixes.Single, itemId)
        )

        return item
    }

    public create = async (menuId: number, data: MenuItem): Promise<MenuItem> => {
        const item = await this.$connection.request<MenuItem>(
            HttpMethod.POST,
            `/menus/${menuId}/items`,
            data,
            this.setScopes([Scopes.Admin])
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
            this.setScopes([Scopes.Admin])
        )

        return item
    }

    public delete = async (menuId: number, itemId: number): Promise<void> => {
        await this.$connection.request<void>(
            HttpMethod.DELETE,
            `/menus/${menuId}/items/${itemId}`,
            undefined,
            this.setScopes([Scopes.Admin])
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
            body,
            this.setScopes([Scopes.Admin]),
            this.createCacheKey(CacheKeyPrefixes.Single, itemId)
        )

        return menuItem
    }
}
