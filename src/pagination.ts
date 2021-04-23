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
 * the resulting data will use the default page amount {@link DEFAULT_PAGE_AMOUNT}.
 *
 * @typeParam T - Return type in the `data` attribute, e.g. a {@link EventCollection}
 */
export interface PaginatedCachedAsyncHookContract<T> extends InfiniteCachedAsyncHookContract<T> {
    pagination?: PaginationMeta
}

/**
 * ## Infinite cached async hook
 * Extends the return type defined by {@link CachedAsyncHookContract} and {@link https://github.com/vercel/swr/blob/master/src/use-swr-infinite.ts|useSWRInfinite}
 *
 * Defines the result of a paginated response. This can be used just like the
 * regular {@link CachedAsyncHookContract}. It exposes an additional property
 * called `pagination` that contains the pagination metadata: {@link PaginationMeta}.
 *
 * Note that if no pagination params is specified in the fetcher hook, e.g. {@link useEvents},
 * the resulting data will use the default page amount {@link DEFAULT_PAGE_AMOUNT}.
 *
 * @typeParam T - Return type in the `data` attribute, e.g. a {@link EventCollection}
 */
export interface InfiniteCachedAsyncHookContract<T> extends CachedAsyncHookContract<T> {
    size: number
    setSize?: (size: number) => void
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
function createPaginationErrorResponse<T, V extends Array<T>>(
    hookData: InfiniteCachedAsyncHookContract<V>,
    responseData: unknown
) {
    return {
        ...hookData,
        error: new ApiError('Failed to paginate response data', responseData),
        data: undefined,
        pagination: undefined,
        size: 0,
        setSize: undefined,
    }
}

/* @internal */
export function createPaginatedResponse<T, V extends Array<T>>(
    hookData: InfiniteCachedAsyncHookContract<V>
): PaginatedCachedAsyncHookContract<V> {
    // If we have not received data we can not transform the response type
    if (!hookData.data) {
        return hookData
    }

    // Recast unknown response so that we can verify its properties
    const responseData = hookData.data as Record<string, unknown>

    if (!Array.isArray(hookData.data) || hookData.data.length === 0) {
        // We should not throw an exception here, since it is not ran inside the
        // SWR hook. Any exception that gets thrown here will not be catched
        // and will crash the application. What we do instead is provide a
        // custom error message in the response.
        return createPaginationErrorResponse(hookData, responseData)
    }

    let concatenatedData: Array<T> = []
    let paginationMeta: unknown

    // useSWRInfinite returns an array of response data, i.e.
    // we must concat the the 'data' field of each item in 'hookData.data'.
    // https://swr.vercel.app/docs/pagination#example-1-index-based-paginated-api
    for (const response of hookData.data) {
        const paginatedData = response as Record<string, unknown>

        // Validate that the response is paginated
        if (!Array.isArray(paginatedData.data) || !paginatedData.hasOwnProperty('meta')) {
            return createPaginationErrorResponse(hookData, responseData)
        }

        if (paginatedData.data.length > 0) {
            // Add all items of the pagination page data
            concatenatedData = concatenatedData.concat(paginatedData.data)
        }

        // Set the pagination meta.
        // The returned meta data will always be for the last page in the
        // pagination. I.e., if you have loaded three pages, you will only
        // receive the meta data for the last page.
        paginationMeta = paginatedData.meta
    }

    return {
        ...hookData,
        data: concatenatedData as V,
        pagination: paginationMeta as PaginationMeta,
    }
}
