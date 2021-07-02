import { expect, test } from '@jest/globals'
import { Auth } from '../src/services/auth'
import { Connection } from '../src/connection'
import 'jest-fetch-mock'
import { ApiError, HttpErrorCodes } from '../src/errors'

const email = 'admin@vdala.se'
const password = 'vdalaadmin'
const baseURL = 'http://nationskollen-staging.engstrand.nu/api/v1'

const connection = new Connection(baseURL, '')
const auth = new Auth(connection)

test('it cannot login a user with invalid credentials', async () => {
    fetchMock.mockOnce(() => {
        return new Promise(() => {
            throw new ApiError(HttpErrorCodes.Unauthorized, 'Unauthorized')
        })
    })

    await expect(auth.login(email, password)).rejects.toThrow()
})

test('it can login a user', async () => {
    fetchMock.mockOnce(() => {
        return new Promise((resolve) => {
            resolve(
                JSON.stringify({
                    id: 1,
                    oid: 400,
                    avatar_img_src: null,
                    nation_admin: true,
                    full_name: 'admin',
                    email: 'admin@vdala.se',
                    remember_me_token: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    token: 'asdfasdf',
                    permissions: [
                        {
                            id: 2,
                            user_id: 1,
                            permission_type_id: 2
                        }
                    ]
                })
            )
        })
    })

    const user = await auth.login(email, password)
    expect(user).not.toBeNull()
    expect(user.token).not.toBeNull()
    expect(user.oid).toEqual(400)
    expect(user.nation_admin).toEqual(true)
})
