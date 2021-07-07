import { expect, test } from '@jest/globals'
import { extractSingleResource } from '../src/utils'
import { CachedAsyncHookContract } from '../src/hooks'
import { ApiError, HttpErrorCodes } from '../src/errors'

interface MockResource {
    id: number
    value: number
}

const MOCK_DATA = [
    { id: 0, value: 100 },
    { id: 1, value: 200 },
    { id: 2, value: 300 },
    { id: 3, value: 400 },
]

test('it can extract a resource from an array of resources', () => {
    const hookData: CachedAsyncHookContract<Array<MockResource>> = {
        data: MOCK_DATA,
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
    }

    const extracted = extractSingleResource<MockResource>(hookData, 'id', 0)

    expect(extracted.data).toBeDefined()
    expect(extracted.error).not.toBeDefined()
    expect(extracted.data?.id).toStrictEqual(0)
    expect(extracted.data?.value).toStrictEqual(100)
})

test('it returns nothing if the resource does not exist', () => {
    const hookData: CachedAsyncHookContract<Array<MockResource>> = {
        data: MOCK_DATA,
        error: undefined,
        isValidating: false,
        mutate: jest.fn(),
    }

    const extracted = extractSingleResource<MockResource>(hookData, 'id', -1)

    expect(extracted.data).not.toBeDefined()
    expect(extracted.error).toBeDefined()
    expect(extracted.error?.type).toStrictEqual(HttpErrorCodes.NoContent)
})

test('it only tries to extract data if no error is set', () => {
    // Some random data to make sure that it gets passed to correctly
    const errorData = 100
    const errorMessage = 'error'

    const hookData: CachedAsyncHookContract<Array<MockResource>> = {
        data: undefined,
        error: new ApiError(HttpErrorCodes.NotFound, errorMessage, errorData),
        isValidating: false,
        mutate: jest.fn(),
    }

    const extracted = extractSingleResource<MockResource>(hookData, 'id', 0)

    expect(extracted.data).not.toBeDefined()
    expect(extracted.error).toBeDefined()
    expect(extracted.error?.message).toStrictEqual(errorMessage)
    expect(extracted.error?.data).toStrictEqual(errorData)
})

test('it does nothing if the request is validating', () => {
    const hookData: CachedAsyncHookContract<Array<MockResource>> = {
        data: undefined,
        error: undefined,
        isValidating: true,
        mutate: jest.fn(),
    }

    const extracted = extractSingleResource<MockResource>(hookData, 'id', -1)

    expect(extracted.data).not.toBeDefined()
    expect(extracted.error).not.toBeDefined()
    expect(extracted.isValidating).toBe(true)
})
