import { expect, test } from '@jest/globals'
import { Auth } from '../src/services/auth'
import { Connection } from '../src/connection'

const email = 'admin@vdala.se'
const password = 'vdalaadmin'
const baseURL = 'http://nationskollnen-staging.engstrand.nu/api/v1'

test('it can login a user', async () => {
    let connection = new Connection(baseURL,'')
    let auth = new Auth(connection)
    const user = await auth.login(email, password)
    expect(user).not.toBeNull()
    expect(user.token).not.toBeNull()
    expect(user.oid).toEqual(400)
})
