/**
 * ## React hooks
 * Contains all the available React hooks in the SDK.
 *
 * Fetcher functions are cached by default using {@link
 * https://swr.vercel.app/|SWR}. This includes data revalidation, automatic
 * rehydration and more. Every fetcher hooks exposes all of the returned values
 * from the `useSWR` hook. This means that you can refer to the SWR documentation
 * for information about how the fetcher hooks can be used.
 *
 * For the other CRUD functions, i.e. `POST`, `PUT` and `DELETE` operations, we
 * use `useAsync` and `useAsyncCallback` from the {@link
 * https://github.com/slorber/react-async-hook|react-async-hook} package.
 *
 * > Note that most of the hooks in this SDK will expose **all** of the returned
 * values from `useSWR`, `useAsync` and `useAsyncCallback` (depending on the
 * one that is used internally in the hook). This means that you can refer to
 * the documentation for each of these for more advanced usage.
 *
 * @see {@link https://swr.vercel.app|SWR}
 * @see {@link https://github.com/slorber/react-async-hook|react-async-hook}
 *
 * @module hooks
 */

/// <reference path="./typings.d.ts" />
import {
    Nation,
    NationCollection,
    Location,
    LocationCollection,
    Event,
    EventCollection,
    Menu,
    MenuCollection,
    MenuItem,
    MenuItemCollection,
    User,
} from './responses'

import useSWR, { useSWRInfinite } from 'swr'
import { useAsyncCallback } from 'react-async-hook'
import { useContext, useState, useEffect } from 'react'

import { Context } from './context'
import { ApiError } from './errors'
import { ActivityLevels } from './responses'
import { createQueryUrl, transformEventQueryParams, EventQueryParams } from './query'
import { PaginatedCachedAsyncHookContract, createPaginatedResponse } from './pagination'

/**
 * ## Async hook
 * Extends the return type defined by {@link
 * https://github.com/slorber/react-async-hook/blob/dddfc1c1b97ff8736b9237c50e2b35610c62ed75/src/index.ts#L43-L48|
 * `useAsync`}.
 *
 * For more information about `useAsync`:
 * @see {@link https://github.com/slorber/react-async-hook|react-async-hook documentation}
 *
 * @typeParam T - Return type in the `result` attribute, e.g. a {@link Nation}
 */
export interface AsyncHookContract<T> {
    result?: T
    error?: Error | ApiError
    loading: boolean
}

/**
 * ## Async hook callback
 * Extends the return type defined by {@link
 * https://github.com/slorber/react-async-hook/blob/dddfc1c1b97ff8736b9237c50e2b35610c62ed75/src/index.ts#L377-L395|
 * `useAsyncCallback`}.
 *
 * For more information about `useAsyncCallback`:
 * @see {@link https://github.com/slorber/react-async-hook|react-async-hook documentation}
 *
 * @typeParam T - Return type in the `result` attribute, e.g. a {@link Nation}
 */
export interface AsyncHookCallbackContract<T> extends AsyncHookContract<T> {
    execute: (...args: any[]) => Promise<T>
}

/**
 * ## Cached async hook
 * Extends the return type defined by {@link
 * https://github.com/vercel/swr/blob/11533ee8d5df6136726c4fc7a05bdbf1ac82fb35/src/types.ts#L118-L130|`useSWR`}.
 *
 * For more information about `useSWR`:
 * @see {@link https://swr.vercel.app/docs/options|SWR Documentation}
 *
 * @typeParam T - Return type in the `data` attribute, e.g. a {@link Nation}
 */
export interface CachedAsyncHookContract<T> {
    data?: T
    error?: Error | ApiError
    mutate: (data?: T | Promise<T>, shouldRevalidate?: boolean) => Promise<T | undefined>
    isValidating: boolean
}

/* @internal */
const NoAutoMutation = {
    refreshInterval: 0,
    revalidateOnFocus: false,
}

/* @internal */
function eventFetcher(endpoint: string, params?: EventQueryParams) {
    return useSWRInfinite((index: number) =>
        createQueryUrl(endpoint, transformEventQueryParams(params), index + 1)
    )
}

/**
 * Hook used to get all the available data from the SDK context.
 * The returned data in this hook is subject to change and it is
 * recommended to instead use the shorthand hooks for extracting your
 * data:
 *
 * @see {@link useApi} for getting the API client handle
 * @see {@link useUser} for getting the currently logged in user
 *
 * @category General
 */
export function useSDK() {
    return useContext(Context)
}

/**
 * Retrieve a handle to the API client for making authenticated `POST`, `PUT` and
 * `DELETE` requests. This should only be used if you want to implement
 * functionality for student nation staff. Fetching data should be done using
 * one of the available fetcher hooks since they will cache your data using {@link https://swr.vercel.app/|SWR}.
 *
 * @category General
 *
 * @example **Updating a student nation description**
 * ```javascript
 * const api = useApi()
 * const [description, setDescription] = useState('')
 * const response = useAsyncCallback(() => api.nations.update({ description }))
 *
 * return (
 *     <div>
 *         {// Make the request to the API when the user clicks the button}
 *         <button onClick={response.execute()}>Update description</button>
 *         {response.error && <p>Could not update nation: {response.error.message}</p>}
 *         {response.result && <p>New description: {response.result.description}</p>}
 *     </div>
 * )
 * ```
 */
export function useApi() {
    return useSDK().api
}

/**
 * Subscribe to activity level changes of a location. Usage of this hook will
 * re-render your component whenever activity data is received from the server
 * Your component will be automatically unsubscribed from a location whenever
 * your component is unmounted or the `locationId` changes.
 *
 * @category Activity
 *
 * @param locationId - The id of the location to subscribe to
 * @param initialActivityLevel - The activity level that will be set on initial render
 * @returns The current activity level of the location
 *
 * @example **Subscribing to activity changes of location**
 * ```javascript
 * // Dynamically subscribes to a locations activity and sets the intial
 * // activity level to the value received after fetching.
 * const activityLevel = useActivityLevel(
 *     props.location.id,
 *     props.location.activity_level
 * )
 *
 * // Will re-render in realtime whenever the activity level is updated on the server
 * return (
 *     <p>Current activity level: {activityLevel}</p>
 * )
 * ```
 */
export function useActivityLevel(
    locationId: number,
    initialActivityLevel?: ActivityLevels
): ActivityLevels {
    const { activity } = useApi()
    const [activityLevel, setActivityLevel] = useState(initialActivityLevel ?? 0)

    useEffect(() => {
        activity.subscribe(locationId, setActivityLevel)
        // Cleanup
        return () => activity.unsubscribe(locationId, setActivityLevel)
    })

    return activityLevel
}

/**
 * Log in a user based on email and password.
 *
 * @category Auth
 */
export function useLogin(): AsyncHookCallbackContract<User> {
    const { api, setUser } = useSDK()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const request = useAsyncCallback(async () => {
        const result = await api.auth.login(email, password)

        // Update the currently logged in user.
        // This will trigger the registered effect callbacks
        // of any components using the 'useUser' hook.
        setUser(result)

        return result
    })

    return {
        ...request,
        email,
        password,
        setEmail,
        setPassword,
    }
}

/**
 * Retrieve a handle to the currently logged in user and all the data associated with the user.
 * If no user is logged in, `null` will be returned. Internally, the user is
 * stored in a state variable and will therefore re-render your component
 * whenever it changes.
 *
 * @category Auth
 *
 * @returns The currently logged in user (if any)
 */
export function useUser() {
    return useSDK().user
}

/**
 * Logout a user.
 *
 * @category Auth
 */
export function useLogout(): AsyncHookCallbackContract<void> {
    const { api, setUser } = useSDK()
    return useAsyncCallback(async () => {
        await api.auth.logout()
        setUser(null)
    })
}

/**
 * Hook to upload images to resources, e.g. student nation or menu items. Only
 * supports a single upload, i.e. you can not upload both an icon and a cover
 * image for a nation with a single call to this hook. If you want to allow
 * multiple uploads, you need to call this hook once for each upload.
 *
 * This hook will automatically add the file blob to the upload function that
 * you select. This means that you can omit the last argument of the upload function.
 * You can see an example of this below.
 *
 * For each upload you must specify the form field (i.e. the upload that you want to make).
 * The available upload fields can be seen in the respective service, e.g.:
 * @see {@link NationUploads} for all available upload fields for student nations
 *
 * @typeParam T The resource that will be returned in the result after uploading, i.e. a {@link Nation}
 * @param fn The upload function to use when `execute()` is called.
 * @param params Upload function arguments with the file blob (last argument) omitted
 * @category Upload
 *
 * @example **Uploading a cover image to a student nation**
 * ```javascript
 * const api = useApi()
 *
 * // Specify the student nation and form field that we want to use.
 * // The uploader also exposes all of the members returned by the 'useAsync' hook.
 * const uploader = useUpload(api.nations.upload, [props.nation.oid, 'cover'])
 *
 * // Using the uploader onChange event handler, the file will be set automatically
 * return (
 *     <div>
 *         <input type="file" onChange={uploader.onFileChanged} />
 *         <button onClick={uploader.execute}>Upload cover image</button>
 *     </div>
 * )
 * ```
 */
export function useUpload<T>(
    fn: (...args: unknown[]) => Promise<T>,
    params: unknown[]
): AsyncHookCallbackContract<T> {
    const [image, setImage] = useState<Blob | null>(null)
    const request = useAsyncCallback(async () => {
        const concatedParamas = [...params, image]
        const result = await fn(...concatedParamas)

        // Reset image
        setImage(null)

        return result
    })

    const onFileChanged = (e: InputEvent) => {
        if (!e.target) {
            return
        }

        const input = e.target as HTMLInputElement

        if (!input.files || !input.files[0]) {
            return
        }

        setImage(input.files[0])
    }

    return {
        ...request,
        onFileChanged,
    }
}

/**
 * Fetches and caches all Nations.
 *
 * @category Fetcher
 */
export function useNations(): CachedAsyncHookContract<NationCollection> {
    return useSWR('/nations')
}

/**
 * Fetches and caches a single Nation.
 *
 * @param oid The oid of the {@link Nation} to fetch
 *
 * @category Fetcher
 */
export function useNation(oid: number): CachedAsyncHookContract<Nation> {
    return useSWR(() => `/nations/${oid}`, NoAutoMutation)
}

/**
 * Fetches and caches all Locations for a Nation.
 *
 * @param oid The oid of the {@link Nation} to fetch locations of
 *
 * @category Fetcher
 */
export function useLocations(oid: number): CachedAsyncHookContract<LocationCollection> {
    return useSWR(() => `/nations/${oid}/locations`, NoAutoMutation)
}

/**
 * Fetches and caches all Locations that are shown on the map.
 *
 * @category Fetcher
 */
export function useMapLocations(): CachedAsyncHookContract<LocationCollection> {
    return useSWR(() => '/locations/map', NoAutoMutation)
}

/**
 * Fetches and caches a single Location.
 *
 * @param oid The oid of the {@link Nation} that owns the {@link Location}
 * @param locationId The id of the {@link Location} to fetch
 *
 * @category Fetcher
 */
export function useLocation(locationId: number): CachedAsyncHookContract<Location> {
    return useSWR(() => `/locations/${locationId}`, NoAutoMutation)
}

/**
 * Fetches and caches Events.
 * If `oid` is set, e.g. not `undefined` or `null`, only the events for that
 * specific Nation will be fetched.
 *
 * @param oid The oid of the {@link Nation} to fetch events for.
 * @param params Event filtering params
 *
 * @example
 * ```typescript
 * // Fetches ALL available events for today
 * const { data } = useEvents(undefined, { date: new Date() })
 *
 * // Fetches today's events for the selected nation (oid 400)
 * const { data } = useEvents(400, { date: new Date() })
 *
 * // You can of course use a variable (e.g. state or prop) to set it dynamically
 * const { data } = useEvent(props.oid, { date: new Date() })
 * // or
 * const [oid, setOid] = useState(null)
 * const { data } = useEvent(oid, { date: new Date() })
 * ```
 *
 * Note that you do not need to specify any query data. By default, it will fetch
 * a total of {@link DEFAULT_PAGINATION_AMOUNT} per page.
 *
 * This hook supports **infinite loading**. To fetch more data, e.g. while scrolling,
 * do the following:
 * ```typescript
 * const { data, error, pagination, size, setSize } = useEvents(null, { amount: 9 })
 * ```
 *
 * To use regular pagination, i.e. to render **only** the data for the page and not
 * the previous pages, you can do the following:
 * ```typescript
 * const [page, setPage] = useState(1)
 * const { data, error, pagination } = useEvents(null, { page, amount: 9 })
 * ```
 *
 * As you can see, the only difference between the two is which state variable you
 * use to decide which page to load.
 *
 * @category Fetcher
 */
export function useEvents(
    oid?: number,
    params?: EventQueryParams
): PaginatedCachedAsyncHookContract<EventCollection> {
    return createPaginatedResponse(eventFetcher(oid ? `/nations/${oid}/events` : '/events', params))
}

/**
 * Fetches and caches a single Event.
 *
 * @param eventId The id of the {@link Event} to fetch
 * @param params Event filtering params
 *
 * @category Fetcher
 */
export function useEvent(
    eventId: number,
    params?: EventQueryParams
): CachedAsyncHookContract<Event> {
    return eventFetcher(`/events/${eventId}`, params)
}

/**
 * Fetches and caches all Menus for a Location.
 *
 * @param locationId The id of the {@link Location} to fetch the menus of
 *
 * @category Fetcher
 */
export function useMenus(locationId: number): CachedAsyncHookContract<MenuCollection> {
    return useSWR(() => `/locations/${locationId}/menus`)
}

/**
 * Fetches and caches a single Menu.
 *
 * @param menuId The id of the {@link Menu} to fetch the menus of
 *
 * @category Fetcher
 */
export function useMenu(menuId: number): CachedAsyncHookContract<Menu> {
    return useSWR(() => `/menus/${menuId}`)
}

/**
 * Fetches and caches all MenuItems for a Menu.
 *
 * @param menuId The id of the {@link Menu} to fetch the items of
 *
 * @category Fetcher
 */
export function useMenuItems(menuId: number): CachedAsyncHookContract<MenuItemCollection> {
    return useSWR(() => `/menus/${menuId}/items`)
}

/**
 * Fetches and caches a single MenuItem.
 *
 * @param menuItemId The id of the {@link MenuItem} to fetch
 *
 * @category Fetcher
 */
export function useMenuItem(menuItemId: number): CachedAsyncHookContract<MenuItem> {
    return useSWR(() => `/items/${menuItemId}`)
}
