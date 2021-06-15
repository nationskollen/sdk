import { expect, test } from '@jest/globals'
import { serializeArray } from '../src/query'

test('it can serialize a non-empty array into csv', () => {
    expect(serializeArray(['1', '2', '3'])).toEqual('1,2,3')
})

test('it returns undefined when serializing an empty array', () => {
    expect(serializeArray([])).toEqual(undefined)
})

test('it returns undefined if no array is passed in', () => {
    expect(serializeArray()).toEqual(undefined)
})
