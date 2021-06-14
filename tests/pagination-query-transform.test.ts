import { expect, test } from '@jest/globals'
import {
    transformPaginationParams,
    DEFAULT_PAGINATION_AMOUNT,
    MAX_PAGINATION_PAGE,
    MIN_PAGINATION_PAGE,
    MIN_PAGINATION_AMOUNT,
} from '../src/query'

test('it can transform undefined parameters', () => {
    expect(transformPaginationParams()).toStrictEqual({ amount: DEFAULT_PAGINATION_AMOUNT })
})

test('it can transform an empty object', () => {
    expect(transformPaginationParams()).toStrictEqual({ amount: DEFAULT_PAGINATION_AMOUNT })
})

test('it can set the page param', () => {
    expect(transformPaginationParams({ page: 10 })).toStrictEqual({
        page: 10,
    })
})

test('it can set the amount param', () => {
    const amount = 30
    expect(transformPaginationParams({ amount })).toStrictEqual({
        amount,
    })
})

test('it can set both params', () => {
    const data = { amount: 10, page: 30 }
    expect(transformPaginationParams(data)).toStrictEqual(data)
})

test('it caps the amount above 0', () => {
    expect(transformPaginationParams({ amount: -100 })).toStrictEqual({
        amount: MIN_PAGINATION_AMOUNT,
    })
})

test('it caps the page below treshold', () => {
    expect(transformPaginationParams({ page: MAX_PAGINATION_PAGE + 1 })).toStrictEqual({
        page: MAX_PAGINATION_PAGE,
    })
})

test('it caps the page above 0', () => {
    expect(transformPaginationParams({ page: -100 })).toStrictEqual({
        page: MIN_PAGINATION_PAGE,
    })
})
