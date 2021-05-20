/**
 * Available filtering parameters for paginated requests.
 * Allows fetching of hidden menus as well.
 *
 * @example Fetching ALL menus, including hidden menus
 * ```javascript
 * const { data } = useMenus(props.location.id, { hidden: true })
 * ```
 */
export interface PaginationQueryParams {
    page?: number
    amount?: number
}

/**
 * Available filtering parameters for events.
 * These can be used to fetch specific events, e.g. on a certain date, etc.
 *
 * When specifying these parameters, only the date part is interesting.
 * This means that you do not need to account for the hour, minute, etc.
 * The specified date(s) will automatically be converted into the correct format,
 * so you can safely pass in a full date using e.g. `new Date()`.
 *
 * `before` and `after` may be specified at the same time, but `date` will
 * always take precedence. If `date` is specified, `before` and `after` will
 * be **ignored**.
 *
 * Note that `excludeOids` will not have any effect if `oid` (first parameter) is set.
 *
 * @example Fetching events that occurs on a date
 * ```javascript
 * // Fetch all events that occurs today.
 * // Note that the date will be automatically converted into the
 * // correct timezone when parsed at the server (UTC+2).
 * const { data } = useEvents(null, { date: new Date() })
 * ```
 *
 * @example Fetching events that occurs after a specified date
 * ```javascript
 * // Fetches all events that occurs after today (not including today).
 * const { data } = useEvents(null, { after: new Date() })
 * ```
 *
 * @example Fetch events for a single nation
 * ```javascript
 * // Fetches events that is created by nation with oid 400
 * const { data } = useEvents(400)
 *
 * // Of course, you may still specify query parameters:
 * const { data } = useEvents(400, { page: 2, amount: 5, after: new Date() })
 * ```
 *
 * @example Passing in the selected nation as a state variable (or prop)
 * const [oid, setOid] = useState(null)
 * const { data } = useEvent(oid, { date: new Date() })
 * ```
 *
 * @example Exclude events from selected nations
 * ```javascript
 * // Fetches events that is not created by the nations with oid 400 and 405
 * const { data } = useEvents(null, { after: new Date(), excludeOids: [400, 405] })
 * ```
 *
 * @example Exclude events with selected categories
 * ```javascript
 * // Fetches events that is not of categories with ids 1, 2 or 3
 * const { data } = useEvents(null, { excludeCategories: [1, 2, 3] })
 * ```
 *
 * @example Fetch events for single category
 * ```javascript
 * // Fetches events that has category with id 1
 * const { data } = useEvents(null, { category: 1 })
 * ```
 *
 * @example Fetch events that is only open for students
 * ```javascript
 * // You can also set it to false to only include events that
 * // does not require you to be a student.
 * const { data } = useEvents(null, { onlyStudents: true })
 * ```
 *
 * @example Fetch events that is only open if you are a member of the nation
 * ```javascript
 * // You can also set it to false to only include events that
 * // does not require you to be a member of the nation
 * const { data } = useEvents(null, { onlyMembers: true })
 * ```
 */
export interface EventQueryParams extends PaginationQueryParams {
    date?: Date
    before?: Date
    after?: Date
    category?: number
    excludeOids?: Array<number>
    excludeCategories?: Array<number>
    onlyStudents?: boolean
    onlyMembers?: boolean
}

/**
 * Available filtering parameters for menus.
 * Allows fetching of hidden menus as well.
 *
 * @example Fetching ALL menus, including hidden menus
 * ```javascript
 * const { data } = useMenus(props.location.id, { hidden: true })
 * ```
 */
export interface MenuQueryParams {
    hidden?: boolean
}

/**
 * Available filtering parameters for notifications.
 * Allows fetching of notifications for specific token and after date.
 *
 * @example Fetching ALL notifications for a token
 * ```javascript
 * const { data } = useNotifications('ExponentPushToken[xxx]')
 * ```
 *
 * @example Fetching ALL notifications for a token after a specific date
 * ```javascript
 * const { data } = useNotifications('ExponentPushToken[xxx]', { after: <some date object> })
 * ```
 */
export interface NotificationQueryParams extends PaginationQueryParams {
    token: string
    after?: Date
}

const MIN_PAGINATION_PAGE = 1
const DEFAULT_PAGINATION_AMOUNT = 20
const MIN_PAGINATION_AMOUNT = 1
const MAX_PAGINATION_PAGE = 5000

/* @internal */
export type TransformedQueryParams = Record<string, unknown>

/**
 * Returns the date part of an ISO string
 */
function serializeToDateString(date: Date) {
    return date.toISOString().split('T')[0]
}

/**
 * Transforms an array of values into a comma-separated list
 */
function serializeArray(array?: Array<unknown>) {
    if (!array || array.length === 0) {
        return
    }

    let csv = ''
    const length = array.length

    for (let i = 0; i < length; i++) {
        csv += array[i]

        // Make sure to not include a trailing comma
        if (i !== length - 1) {
            csv += ','
        }
    }

    return csv
}

/* @internal */
export function createQueryUrl(
    endpoint: string,
    params: TransformedQueryParams,
    pageIndex?: number
) {
    const keys = Object.keys(params)

    if (keys.length === 0) {
        return endpoint
    }

    let queryString = '?'

    // If no page is specified, use the page index from useSWRInfinite
    if (!params.page && pageIndex) {
        queryString += `page=${pageIndex}&`
    }

    keys.forEach((param, index) => {
        queryString += `${param}=${params[param]}`

        // Make sure that we do not get a trailing '&'
        if (index !== keys.length - 1) {
            queryString += '&'
        }
    })

    return `${endpoint}${queryString}`
}

/**
 * Transforms an object containing pagination paramaters into valid menu pagination params.
 *
 * @internal
 */
export function transformPaginationParams<T extends PaginationQueryParams>(
    params?: T
): TransformedQueryParams {
    const queries: TransformedQueryParams = {}

    if (!params) {
        queries['amount'] = DEFAULT_PAGINATION_AMOUNT
        return queries
    }

    if (params.page) {
        queries['page'] = Math.max(Math.min(params.page, MAX_PAGINATION_PAGE), MIN_PAGINATION_PAGE)
    }

    if (params.amount) {
        queries['amount'] = Math.max(params.amount, MIN_PAGINATION_AMOUNT)
    }

    return queries
}

/**
 * Transforms an object of parameters into valid event query params.
 *
 * @internal
 */
export function transformEventQueryParams(
    oid?: number,
    params?: EventQueryParams
): TransformedQueryParams {
    const queries = transformPaginationParams(params)

    if (!params) {
        return queries
    }

    // If filtering by exact date, you can not specify
    // the 'before' or 'after' query params.
    if (params.date) {
        queries['date'] = serializeToDateString(params.date)
    } else {
        if (params.before) {
            queries['before'] = serializeToDateString(params.before)
        }

        if (params.after) {
            queries['after'] = serializeToDateString(params.after)
        }
    }

    if (params.category) {
        queries['category'] = params.category
    } else if (params.excludeCategories) {
        queries['exclude_categories'] = serializeArray(params.excludeCategories)
    }

    // If oid is defined, we can not specify exclusion oids
    // (the endpoint does not support that filter)
    if (!oid && params.excludeOids) {
        queries['exclude_oids'] = serializeArray(params.excludeOids)
    }

    if (params.hasOwnProperty('onlyMembers')) {
        queries['only_members'] = params.onlyMembers
    }

    if (params.hasOwnProperty('onlyStudents')) {
        queries['only_students'] = params.onlyStudents
    }

    return queries
}

/**
 * Transforms an object of parameters into valid menu query params.
 *
 * @internal
 */
export function transformMenuQueryParams(params?: MenuQueryParams): TransformedQueryParams {
    const queries: TransformedQueryParams = {}

    if (!params) {
        return queries
    }

    if (params.hidden) {
        queries['hidden'] = true
    }

    return queries
}

/**
 * Transforms an object of parameters into valid notification query params.
 *
 * @internal
 */
export function transformNotificationQueryParams(
    params?: NotificationQueryParams
): TransformedQueryParams {
    const queries = transformPaginationParams(params)

    if (!params) {
        return queries
    }

    if (params.after) {
        queries['after'] = serializeToDateString(params.after)
    }

    // Make sure to include the token in the query string
    queries['token'] = params.token

    return queries
}
