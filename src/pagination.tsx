import { ApiError } from './errors'
import { CachedAsyncHookContract } from './hooks'

/**
 * ## Paginated cached async hook
 * Extends the return type defined by {@link CachedAsyncHookContract}
 *
 * Defines the result of a paginated response. This can be used just like the
 * regular {@link CachedAsyncHookContract}. It exposes an additional property
 * called `pagination` that contains the pagination metadata: {@link PaginationMeta}.
 *
 * Note that if no pagination params is specified in the fetcher hook, e.g. {@link useEvents},
 * the resulting data will contain **all** events. Same goes for all paginated hooks.
 *
 * @typeParam T - Return type in the `data` attribute, e.g. a {@link EventCollection}
 */
export interface PaginatedCachedAsyncHookContract<T> extends CachedAsyncHookContract<T> {
    pagination?: PaginationMeta,
}

/**
 * ## Pagination metadata
 * Defines the metadata of a paginated request.
 */
export interface PaginationMeta {
    total: number
    per_page: number
    current_page: number
    first_page: number
    last_page: number
    first_page_url: string
    last_page_url: string
    next_page_url: string | null
    previous_page_url: string | null
}

/* @internal */
export function createPaginatedResponse<T, V extends Array<T>>(hookData: CachedAsyncHookContract<V>): PaginatedCachedAsyncHookContract<V> {
    // If we have not received data we can not transform the response type
    if (!hookData.data) {
        return hookData
    }

    const responseData = hookData.data as Record<string, unknown>

    // Validate the structure of the response and make sure that it can be paginated
    if (!Array.isArray(responseData.data) || !responseData.hasOwnProperty('meta') || !responseData.hasOwnProperty('data')) {
        throw new ApiError('Could not paginate response. Response data is not paginated', responseData)
    }

    return {
        ...hookData,
        data: responseData.data as V,
        pagination: responseData.meta as PaginationMeta,
    }
}
