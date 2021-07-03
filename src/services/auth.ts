import { BaseService } from './base'
import { AuthenticatedUser } from '../responses'
import { HttpErrorCodes, ApiError } from '../errors'
import { Connection, HttpMethod } from '../connection'

export class Auth extends BaseService {
    public user?: AuthenticatedUser

    constructor(connection: Connection) {
        super(connection)
    }

    public login = async (email: string, password: string): Promise<AuthenticatedUser> => {
        const user = await this.$connection.request<AuthenticatedUser>(
            HttpMethod.POST,
            '/users/login',
            {
                email,
                password,
            },
            false,
            true
        )

        if (!user.hasOwnProperty('token')) {
            throw new ApiError(
                HttpErrorCodes.InternalError,
                'Could not read token from login response'
            )
        }

        if (!user.hasOwnProperty('permissions')) {
            throw new ApiError(
                HttpErrorCodes.InternalError,
                'Could not read permissions from login response'
            )
        }

        this.$connection.setUser(user)

        return user
    }

    public async setToken(token?: string): Promise<AuthenticatedUser> {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }

        const response = await fetch(this.$connection.createUrl('/auth/me'), {
            method: HttpMethod.GET,
            headers,
        })

        const user = await response.json()

        this.$connection.checkForErrors(response.status, user)
        this.$connection.setUser(user)

        return user
    }

    public logout = async (): Promise<void> => {
        await this.$connection.request(HttpMethod.POST, '/users/logout', undefined, true, true)

        this.$connection.setUser(undefined)
    }
}
