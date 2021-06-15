import { expect, test } from '@jest/globals'
import { transformPaginationParams, transformEventQueryParams } from '../src/query'

const OID = 400

test('it can transform an empty object', () => {
    const paginationParams = transformPaginationParams()
    expect(transformEventQueryParams(OID)).toStrictEqual(paginationParams)
})

test('it can transform undefined', () => {
    const paginationParams = transformPaginationParams()
    expect(transformEventQueryParams(OID)).toStrictEqual(paginationParams)
})

test('it can set the date', () => {
    const date = '2021-01-01'

    expect(transformEventQueryParams(OID, { date: new Date(date) })).toStrictEqual({
        date,
    })
})

test('it can set a date interval', () => {
    const date = '2021-01-01'
    const dateEnd = '2021-01-02'

    expect(
        transformEventQueryParams(OID, { after: new Date(date), before: new Date(dateEnd) })
    ).toStrictEqual({
        after: date,
        before: dateEnd,
    })
})

test('it removes the date interval if a single date is specified', () => {
    const date = '2021-01-01'
    const dateEnd = '2021-01-02'

    const queries = transformEventQueryParams(OID, {
        date: new Date(date),
        after: new Date(date),
        before: new Date(dateEnd),
    })

    expect(queries).toStrictEqual({ date })
    expect(queries).not.toHaveProperty('after')
    expect(queries).not.toHaveProperty('before')
})

test('it can set a category', () => {
    const category = 1

    expect(transformEventQueryParams(OID, { category })).toStrictEqual({
        category,
    })
})

test('it does not include exclusion nations if oid is defined', () => {
    expect(transformEventQueryParams(OID, { excludeOids: [100, 200, 300] })).not.toHaveProperty(
        'excludeOids'
    )
})

test('it includes exclusion nations if oid is undefined', () => {
    expect(
        transformEventQueryParams(undefined, { excludeOids: [100, 200, 300] })
    ).not.toHaveProperty('excludeOids')
})

test('it removes the exclusion categories if a category is defined', () => {
    const category = 1
    const queries = transformEventQueryParams(OID, {
        category,
        excludeCategories: [1, 2, 3],
    })

    expect(queries).toStrictEqual({ category })
    expect(queries).not.toHaveProperty('exclude_categories')
})

test('it can set members only to true', () => {
    expect(transformEventQueryParams(OID, { onlyMembers: true })).toStrictEqual({
        only_members: true,
    })
})

test('it can set students only to true', () => {
    expect(transformEventQueryParams(OID, { onlyStudents: true })).toStrictEqual({
        only_students: true,
    })
})

test('it can set members only to false', () => {
    expect(transformEventQueryParams(OID, { onlyMembers: false })).toStrictEqual({
        only_members: false,
    })
})

test('it can set students only to false', () => {
    expect(transformEventQueryParams(OID, { onlyStudents: false })).toStrictEqual({
        only_students: false,
    })
})
