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
 * @example Fetching events that occurs on a date
 * ```javascript
 * // Fetch all events that occurs today.
 * // Note that the date will be automatically converted into the
 * // correct timezone when parsed at the server (UTC+2).
 * const { data } = useEvents({ date: new Date() })
 * ```
 *
 * @example Fetching events that occurs after a specified date
 * ```javascript
 * // Fetches all events that occurs after today (not including today).
 * const { data } = useEvents({ after: new Date() })
 * ```
 */
export interface EventQueryParams {
    date?: Date
    before?: Date
    after?: Date
    page?: number
    amount?: number
}

const MIN_PAGINATION_PAGE = 1
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

/* @internal */
export function createQuery(params: TransformedQueryParams) {
    const keys = Object.keys(params)

    if (keys.length === 0) {
        return ''
    }

    let queryString = '?'

    keys.forEach((param, index) => {
        queryString += `${param}=${params[param]}`

        // Make sure that we do not get a trailing '&'
        if (index !== keys.length - 1) {
            queryString += '&'
        }
    })

    return queryString
}

/**
 * Transforms an object of parameters into valid event query params.
 *
 * @internal
 */
export function transformEventQueryParams(params: EventQueryParams): TransformedQueryParams {
    const queries: TransformedQueryParams = {}

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

    // TODO: Can be extracted into a separate transform function
    if (params.page) {
        queries['page'] = Math.max(Math.min(params.page, MAX_PAGINATION_PAGE), MIN_PAGINATION_PAGE)
    }

    if (params.amount) {
        queries['amount'] = Math.max(params.amount, MIN_PAGINATION_AMOUNT)
    }

    return queries
}
