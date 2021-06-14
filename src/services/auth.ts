import { BaseService } from './base'
import { User, Scopes } from '../responses'
import { HttpErrorCodes, ApiError } from '../errors'
import { Connection, HttpMethod } from '../connection'

export class Auth extends BaseService {
    public user?: User

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
                'Could not read token from login response',
            )
        }

        if (!user.hasOwnProperty('scope')) {
            throw new ApiError(
                HttpErrorCodes.InternalError,
                'Could not read token scope from login response',
            )
        }

        this.user = user
        this.setUser(user)

        return user
    }

    public setUser(user?: User) {
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

        this.user = undefined
        this.setUser(undefined)
    }
}
