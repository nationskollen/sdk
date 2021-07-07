import 'jest-fetch-mock'
import { Auth } from '../src/services/auth'
import { expect, test } from '@jest/globals'
import { Connection } from '../src/connection'
import { ApiError, HttpErrorCodes } from '../src/errors'

const EMAIL = 'admin@vdala.se'
const PASSWORD = 'vdalaadmin'

const TEST_USER_DATA = {
    id: 1,
    oid: 400,
    avatar_img_src: null,
    nation_admin: true,
    full_name: 'admin',
    email: 'admin@vdala.se',
    remember_me_token: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    permissions: [
        {
            id: 2,
            user_id: 1,
            permission_type_id: 2,
        },
    ],
}

const connection = new Connection('http://nationskollen-staging.engstrand.nu/api/v1', '')
const auth = new Auth(connection)

test('it cannot login a user with invalid credentials', async () => {
    fetchMock.mockOnce(() => {
        return new Promise(() => {
            throw new ApiError(HttpErrorCodes.Unauthorized, 'Unauthorized')
        })
    })

    await expect(auth.login(EMAIL, PASSWORD)).rejects.toThrow()
})

test('it can login a user', async () => {
    fetchMock.mockOnce(() => {
        return new Promise((resolve) => {
            resolve(JSON.stringify({ ...TEST_USER_DATA, token: 'token' }))
        })
    })

    const user = await auth.login(EMAIL, PASSWORD)
    expect(user).not.toBeNull()
    expect(user.token).not.toBeNull()
    expect(user.oid).toEqual(400)
    expect(user.nation_admin).toEqual(true)
})

test('it can login a user via token', async () => {
    const token = 'testtoken'

    fetchMock.mockOnce(() => {
        return new Promise((resolve) => {
            resolve(JSON.stringify(TEST_USER_DATA))
        })
    })

    const user = await auth.setToken(token)
    expect(user).not.toBeNull()
    expect(user.oid).toEqual(400)
    expect(user.nation_admin).toEqual(true)

    // Validate that the token and type is added to the user
    expect(user.token).toStrictEqual(token)
    expect(user.type).toStrictEqual('bearer')

    // Also make sure that the connection receives the user
    // containing the token
    expect(connection.getToken()).toStrictEqual(token)
})
