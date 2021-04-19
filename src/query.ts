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
}

/* @internal */
export type TransformedQueryParams = Record<string, unknown>

/**
 * Returns the date part of an ISO string
 */
function serializeToDateString(date: Date) {
    return date.toISOString().split('T')[0]
}

/* @internal */
export function transformEventQueryParams(params: EventQueryParams): TransformedQueryParams {
    if (params.date) {
        // If filtering by exact date, you can not specify
        // the 'before' or 'after' query params.
        return {
            date: serializeToDateString(params.date),
        }
    }

    const queries: TransformedQueryParams = {}

    if (params.before) {
        queries['before'] = serializeToDateString(params.before)
    }

    if (params.after) {
        queries['after'] = serializeToDateString(params.after)
    }

    return queries
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
