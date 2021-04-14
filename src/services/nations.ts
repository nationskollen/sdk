import { BaseService } from './base'
import { createUploadBody } from '../uploads'
import { Connection, HttpMethod } from '../connection'
import { NationCollection, Nation, ResourceOptions, Scopes } from '../typings'

enum NationUploads {
    Icon = 'icon',
    Cover = 'cover',
}

enum CacheKeyPrefixes {
    All = 'nationAll',
    Single = 'nationSingle',
}

export class Nations extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public all = async (options?: ResourceOptions): Promise<NationCollection> => {
        const nations = await this.$connection.request<NationCollection>(
            HttpMethod.GET,
            '/nations',
            undefined,
            options,
            CacheKeyPrefixes.All
        )

        return nations
    }

    public single = async (oid: number, options?: ResourceOptions): Promise<Nation> => {
        const nation = await this.$connection.request<Nation>(
            HttpMethod.GET,
            `/nations/${oid}`,
            undefined,
            options,
            this.createCacheKey(CacheKeyPrefixes.Single, oid)
        )

        return nation
    }

    public update = async (oid: number, change: Partial<Nation>): Promise<Nation> => {
        const nation = await this.$connection.request<Nation>(
            HttpMethod.PUT,
            `/nations/${oid}`,
            change,
            this.setScopes([Scopes.Admin])
        )

        return nation
    }

    public upload = async (oid: number, field: NationUploads, file: Blob): Promise<Nation> => {
        const body = createUploadBody({ [field]: file })
        const nation = await this.$connection.upload<Nation>(
            `/nations/${oid}/upload`,
            body,
            this.setScopes([Scopes.Admin]),
            this.createCacheKey(CacheKeyPrefixes.Single, oid)
        )

        return nation
    }
}
