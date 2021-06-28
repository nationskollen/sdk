import { BaseService } from './base'
import { User, Scopes } from '../responses'
import { HttpErrorCodes, ApiError } from '../errors'
import { Connection, HttpMethod } from '../connection'

export class Auth extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public login = async (email: string, password: string): Promise<User> => {
        const user = await this.$connection.request<User>(HttpMethod.POST, '/users/login', {
            email,
            password,
        })

        if (!user.hasOwnProperty('token')) {
            throw new ApiError(
                HttpErrorCodes.InternalError,
                'Could not read token from login response'
            )
        }

        if (!user.hasOwnProperty('scope')) {
            throw new ApiError(
                HttpErrorCodes.InternalError,
                'Could not read token scope from login response'
            )
        }

        this.$connection.setUser(user)

        return user
    }

    public async setToken(token?: string) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }

        const response = await fetch(this.$connection.createUrl('/auth/me'), {
            method:HttpMethod.GET,
            headers,
        })

        this.$connection.checkForErrors(response.status)


        const user = await response.json()

        this.$connection.setUser(user)
    }

    public logout = async (): Promise<void> => {
        await this.$connection.request(
            HttpMethod.POST,
            '/users/logout',
            undefined,
            [Scopes.Admin, Scopes.Staff],
            true
        )

        this.$connection.setUser(undefined)
    }
}
