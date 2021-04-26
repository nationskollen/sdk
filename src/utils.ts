import { ApiError } from './errors'
import { CachedAsyncHookContract, ExtractedCachedAsyncHookContract } from './hooks'

export function removeCallback<T>(array: Array<T>, cb: T) {
    // Find and remove the callback from the callback array, mutating the original
    for (let i = array.length - 1; i >= 0; i--) {
        if (array[i] === cb) {
            array.splice(i, 1)
        }
    }
}

export function createUploadBody(data: Record<string, Blob>) {
    const form = new FormData()

    for (const [key, value] of Object.entries(data)) {
        if (!value) {
            continue
        }

        form.append(key, value)
    }

    return form
}

/**
 * Extracts a single resource from a resource collection, i.e. a {@link NationCollection}.
 * This allows us to maximize the use of the cached requests made by SWR.
 * Instead of fetching the resources again, separately, we fetch the entire collection
 * once and extracts the resource that we want from the array.
 *
 * This also comes with the benefit of automatically invalidating data
 * that uses single resources. Without this, invalidating the entire collection
 * would not automatically invalidate the single resource, since it was fetched
 * using a unique key.
 */
export function extractSingleResource<R, T extends Array<R>, K extends keyof R>(
    hookData: CachedAsyncHookContract<T>,
    extractKey: K,
    searchValue: R[K]
): ExtractedCachedAsyncHookContract<R, T> {
    // Create a default error response
    const response: ExtractedCachedAsyncHookContract<R, T> = {
        ...hookData,
        data: undefined,
    }

    // If the data is empty, no resource can be extracted.
    // Either the response failed or the data has not yet been received.
    // We make sure to return the error (if any) from useSWR.
    if (!hookData.data) {
        return response
    }

    for (const resource of hookData.data) {
        if (resource[extractKey] === searchValue) {
            response.data = resource
            return response
        }
    }

    // We have received a response from the server, but the data did
    // not contain the resource we were looking for.
    response.error = new ApiError(
        `Could not find resource with key ${extractKey} and value ${searchValue}`
    )

    return response
}
