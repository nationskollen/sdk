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
    EventDescription,
    EventCollection,
    Menu,
    MenuCollection,
    MenuItem,
    MenuItemCollection,
    SingleUser,
    AuthenticatedUser,
    UsersCollection,
    OpeningHour,
    OpeningHourCollection,
    CategoryCollection,
    SubscriptionTopic,
    SubscriptionTopicCollection,
    Subscription,
    SubscriptionCollection,
    NotificationCollection,
    Individual,
    IndividualCollection,
    ContactInformation,
    PermissionsTypeCollection,
} from './responses'

import {
    createQueryUrl,
    transformEventQueryParams,
    transformMenuQueryParams,
    transformPaginationParams,
    transformNotificationQueryParams,
    EventQueryParams,
    MenuQueryParams,
    NotificationQueryParams,
    PaginationQueryParams,
    TransformedQueryParams,
} from './query'

import useSWR, { useSWRInfinite } from 'swr'
import { useAsyncCallback } from 'react-async-hook'
import { useContext, useState, useEffect } from 'react'

import { Context } from './context'
import { ApiError, HttpErrorCodes } from './errors'
import { ActivityLevels } from './responses'
import { extractSingleResource } from './utils'
import { UploaderFunction, UploadFieldType } from './upload'
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
    error?: ApiError
    loading: boolean
}

/**
 * ## Get authorized fetcher
 *
 * Provides authorization checking when using hooks (fetching data).
 * For example `usePermissionTypes` needs authentication, this method below
 * makes sure a user is authenticated and that there is a token in the SDK.
 *
 * Used within SWR methods that accept headers.
 *
 * @example **Updating a student nation description**
 * ```javascript
 * useSWR('/route/that/needs/authentication', getAuthorizedFetcher())
 * ```
 *
 * @returns headers - Return headers containgin the Authorization token
 */
function getAuthorizedFetcher() {
    const { baseURL, api } = useSDK()
    const token = api.connection.getToken()

    if (!token) {
        throw new ApiError(
            HttpErrorCodes.Unauthorized,
            'Missing bearer token. Did you forget to run "api.auth.login()" or "api.auth.setUser()"?'
        )
    }

    return (url: string) =>
        fetch(`${baseURL}${url}`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json())
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
    error?: ApiError
    mutate: (data?: T | Promise<T>, shouldRevalidate?: boolean) => Promise<T | undefined>
    isValidating: boolean
}

/**
 * ## Extracted cached async hook
 * Extends the return type defined by {@link CachedAsyncHookContract}.
 *
 * Used to extract single resources from cached resource colletions to
 * prevent unnecessary requests.
 *
 * @typeParam T - Resource collection type, e.g. {@link NationCollection}
 * @typeParam R - Extracted resource from the collection in T, e.g. {@link Nation}
 */
export interface ExtractedCachedAsyncHookContract<R, T extends Array<R>>
    extends Omit<CachedAsyncHookContract<T>, 'data'> {
    data?: R
}

/* @internal */
const NoAutoMutation = {
    refreshInterval: 0,
    revalidateOnFocus: false,
}

/* @internal */
function eventFetcher(endpoint: string, params: TransformedQueryParams) {
    return useSWRInfinite((index: number) => createQueryUrl(endpoint, params, index + 1))
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
 *         <button onClick={response.execute}>Update description</button>
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
 * @example **Login**
 * ```javascript
 * const [email, setEmail] = useState()
 * const [password, setPassword] = useState()
 * const { result, error, execute } = useLogout()
 *
 *
 * useEffect(() => {
 *     if (result) {
 *         // Successfully logged in.
 *         // result = {
 *         //     type: "bearer",
 *         //     token: "<token>",
 *         //     scope: "<scope>",
 *         //     oid: <oid>,
 *         // }
 *     }
 * }, [result])

 * useEffect(() => {
 *     if (error) {
 *         console.log(error.type) // e.g. HttpErrorCodes.BadRequest if credentials are invalid
 *         console.log(error.data) // error message or validation errors
 *     }
 * }, [error])
 *
 * return (
 *     <form>
 *         <input type="email" onChange={..} />
 *         <input type="password" onChange={..} />
 *         <button onClick={() => execute(email, password)}>Logout</button>
 *     </form>
 * )
 * ```
 *
 * @category Auth
 */
export function useLogin(): AsyncHookCallbackContract<AuthenticatedUser> {
    const { api } = useSDK()
    return useAsyncCallback(api.auth.login)
}

/**
 * Logout a user.
 *
 * @example **Logout**
 * ```javascript
 * const { execute } = useLogout()
 *
 * return (
 *     <button onClick={execute}>Logout</button>
 * )
 * ```
 *
 * @category Auth
 */
export function useLogout(): AsyncHookCallbackContract<void> {
    const api = useApi()
    return useAsyncCallback(api.auth.logout)
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
 * const [image, setImage] = useState()
 *
 * // Specify the student nation and form field that we want to use.
 * // The uploader also exposes all of the members returned by the 'useAsync' hook.
 * const uploader = useUpload(api.nations.upload)
 *
 * // Using the uploader onChange event handler, the file will be set automatically
 * return (
 *     <div>
 *         <input type="file" onChange={..} />
 *         <button onClick={() => uploader.execute(props.oid, 'cover', image)}>
 *             Upload cover image
 *         </button>
 *     </div>
 * )
 * ```
 */
export function useUpload<T, F extends UploadFieldType>(
    fn: UploaderFunction<T, F>
): AsyncHookCallbackContract<T> {
    return useAsyncCallback(fn)
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
 * **Note that the `oid` MUST be a number**, otherwise, the request will fail.
 *
 * @param oid The oid of the {@link Nation} to fetch
 *
 * @category Fetcher
 */
export function useNation(oid: number): ExtractedCachedAsyncHookContract<Nation, NationCollection> {
    return extractSingleResource(useSWR(`/nations`, NoAutoMutation), 'oid', oid)
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
 * See all available query parameters here: {@link EventQueryParams}.
 * Note that you do not need to specify any query data.
 *
 * This hook supports **infinite loading**. To fetch more data, e.g. while scrolling,
 * do the following:
 *
 * ```typescript
 * const { data, error, pagination, size, setSize } = useEvents(null, { amount: 9 })
 * ```
 *
 * You can then load more events by increasing the `size` using `setSize(size + 1)`.
 * Of course, you can also decrease the size by doing `setSize(size - 1)`.
 *
 * To use regular pagination, i.e. to render **only** the data for the page and not
 * the previous pages, you can do the following:
 *
 * ```typescript
 * const [page, setPage] = useState(1)
 * const { data, error, pagination } = useEvents(null, { page, amount: 9 })
 * ```
 *
 * As you can see, the only difference between the two is which state variable you
 * use to decide which page to load.
 *
 * @param oid The oid of the {@link Nation} to fetch events for.
 * @param params Event filtering params
 *
 * @category Fetcher
 */
export function useEvents(
    oid?: number,
    params?: EventQueryParams
): PaginatedCachedAsyncHookContract<EventCollection> {
    return createPaginatedResponse(
        eventFetcher(
            oid ? `/nations/${oid}/events` : '/events',
            transformEventQueryParams(oid, params)
        )
    )
}

/**
 * Fetches and caches a single Event.
 *
 * See all available query parameters here: {@link EventQueryParams}.
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
    return eventFetcher(`/events/${eventId}`, transformEventQueryParams(undefined, params))
}

/**
 * Fetches and caches a single Event long description.
 * This should be used when you want to show the full (long) description
 * of an event. It is not needed in the timeline, only when the user
 * wants to read more of an event.
 *
 * @param eventId The id of the {@link Event} to fetch
 *
 * @category Fetcher
 */
export function useEventDescription(eventId: number): CachedAsyncHookContract<EventDescription> {
    return useSWR(() => `/events/${eventId}/description`)
}

/**
 * Fetches and caches all Menus for a Location.
 *
 * @param locationId The id of the {@link Location} to fetch the menus of
 *
 * @category Fetcher
 */
export function useMenus(
    locationId: number,
    params?: MenuQueryParams
): CachedAsyncHookContract<MenuCollection> {
    return useSWR(() =>
        createQueryUrl(`/locations/${locationId}/menus`, transformMenuQueryParams(params))
    )
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
 * Fetches and caches all users for a Nation.
 * Hook (route) is session protected, meaning only an authorized user is allowed to
 * fetch users
 *
 * See all available query parameters here: {@link PaginationQueryParams}.
 *
 * @param oid The id of the {@link Nation} to fetch the users of
 *
 * @category Fetcher
 */

export function useUsers(
    oid: number,
    params?: PaginationQueryParams
): PaginatedCachedAsyncHookContract<UsersCollection> {
    return createPaginatedResponse(
        useSWRInfinite(
            (index: number) =>
                createQueryUrl(
                    `/nations/${oid}/users`,
                    transformPaginationParams(params),
                    index + 1
                ),
            getAuthorizedFetcher()
        )
    )
}

/**
 * Fetches and caches a single user in a nation.
 * Hook (route) is session protected, meaning only an authorized user is allowed to
 * fetch a user
 *
 * @param userId The id of the {@link User} to fetch
 *
 * @category Fetcher
 */
export function useUser(userId: number): CachedAsyncHookContract<SingleUser> {
    return useSWR(() => `/users/${userId}`, getAuthorizedFetcher())
}

/**
 * Fetches and caches all MenuItems for a Menu.
 *
 * See all available query parameters here: {@link PaginationQueryParams}.
 *
 * @param menuId The id of the {@link Menu} to fetch the items of
 *
 * @category Fetcher
 */
export function useMenuItems(
    menuId: number,
    params?: PaginationQueryParams
): PaginatedCachedAsyncHookContract<MenuItemCollection> {
    return createPaginatedResponse(
        useSWRInfinite((index: number) =>
            createQueryUrl(`/menus/${menuId}/items`, transformPaginationParams(params), index + 1)
        )
    )
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

/**
 * Fetches and caches all OpeningHours for a location.
 *
 * @param locationId The id of the {@link Location} to fetch opening hours of
 *
 * @category Fetcher
 */
export function useOpeningHours(
    locationId: number
): CachedAsyncHookContract<OpeningHourCollection> {
    return useSWR(() => `/locations/${locationId}/hours`)
}

/**
 * Fetches and caches a single OpeningHour.
 *
 * @param locationId The id of the {@link Location} to fetch opening hour of
 * @param openingHourId The id of the {@link OpeningHour} to fetch
 *
 * @category Fetcher
 */
export function useOpeningHour(
    locationId: number,
    openingHourId: number
): ExtractedCachedAsyncHookContract<OpeningHour, OpeningHourCollection> {
    return extractSingleResource(
        useSWR(() => `/locations/${locationId}/hours`),
        'id',
        openingHourId
    )
}

/**
 * Fetches and caches all categories.
 *
 * @category Fetcher
 */
export function useCategories(): CachedAsyncHookContract<CategoryCollection> {
    return useSWR(() => '/categories')
}

/**
 * Fetches and caches all permission types.
 *
 * @category Fetcher
 */
export function usePermissionTypes(): CachedAsyncHookContract<PermissionsTypeCollection> {
    return useSWR(() => '/permissions/types', getAuthorizedFetcher)
}

/**
 * Fetches and caches all subscription topics.
 *
 * @category Fetcher
 */
export function useSubscriptionTopics(): CachedAsyncHookContract<SubscriptionTopicCollection> {
    return useSWR(() => '/subscriptions/topics')
}

/**
 * Fetches and caches a single subscription topic.
 *
 * @category Fetcher
 */
export function useSubscriptionTopic(
    id: number
): ExtractedCachedAsyncHookContract<SubscriptionTopic, SubscriptionTopicCollection> {
    return extractSingleResource(
        useSWR(() => '/subscriptions/topics'),
        'id',
        id
    )
}

/**
 * Fetches and caches all subscriptions for a token.
 *
 * @category Fetcher
 */
export function useSubscriptions(token: string): CachedAsyncHookContract<SubscriptionCollection> {
    return useSWR(() => `/subscriptions?token=${token}`)
}

/**
 * Fetches and caches a single subscription.
 *
 * @category Fetcher
 */
export function useSubscription(uuid: string): CachedAsyncHookContract<Subscription> {
    return useSWR(() => `/subscriptions/${uuid}`)
}

/**
 * Fetches and caches all notifications for a token.
 *
 * See all available query parameters here: {@link NotificationQueryParams}.
 *
 * @category Fetcher
 */
export function useNotifications(
    token: string,
    params?: Partial<NotificationQueryParams>
): PaginatedCachedAsyncHookContract<NotificationCollection> {
    return createPaginatedResponse(
        useSWRInfinite((index: number) =>
            createQueryUrl(
                `/notifications`,
                transformNotificationQueryParams({ token, ...params }),
                index + 1
            )
        )
    )
}

/**
 * Fetches and caches all individuals for a nation.
 *
 * @category Fetcher
 */
export function useIndividuals(oid: number): CachedAsyncHookContract<IndividualCollection> {
    return useSWR(() => `/nations/${oid}/individuals`)
}

/**
 * Fetches and caches a single individual.
 *
 * @category Fetcher
 */
export function useIndividual(iid: number): CachedAsyncHookContract<Individual> {
    return useSWR(() => `/individuals/${iid}`)
}

/**
 * Fetches and caches the contact information for a nation.
 *
 * @category Fetcher
 */
export function useContactInformation(oid: number): CachedAsyncHookContract<ContactInformation> {
    return useSWR(() => `/nations/${oid}/contact`)
}
